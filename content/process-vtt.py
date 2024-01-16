import sys
import MeCab
import json
import jUtils
print(sys.argv)

readingLookupTable = {}
tagger = MeCab.Tagger()

def requestReadings(kanjiText, hiraganaString):
    assert jUtils.isKanji(kanjiText[0]), 'First character is kanji'

    readings = []
    while(kanjiText != ""):
        # separate chunk of kanji from string
        kanji = ""
        while(kanjiText != "" and jUtils.isKanji(kanjiText[0])):
            kanji += kanjiText[0]
            kanjiText = kanjiText[1:]

        # request reading for kanji chunk
        print(f'Enter reading for {kanji} ({hiraganaString})')
        reading = input()
        readings.append({'text':kanji, 'reading': reading})

        nonKanji = ""
        while(kanjiText != "" and not jUtils.isKanji(kanjiText[0])):
            nonKanji += kanjiText[0]
            kanjiText = kanjiText[1:]

        if(nonKanji != ""):
            readings.append({'text':nonKanji,})

    return readings
        

def getReading(kanjiText, hiraganaString):
    originalText = kanjiText
    # text without kanji can be returned as is
    if(not jUtils.textIncludesKanji(kanjiText)):
        return [{'text': kanjiText}]

    # ambiguous readings are verified by script user and stored for repeats
    if(readingLookupTable.get(originalText)):
        return readingLookupTable.get(originalText)

    readings = []

    # remove any matching characters at the start of the strings
    leadingHiragana = ""
    if(not jUtils.isKanji(kanjiText[0])):
        while(kanjiText[0] == hiraganaString[0] or 
              jUtils.convertKatakanaToHiragana(kanjiText[0]) == hiraganaString[0]):
            leadingHiragana += kanjiText[0]
            kanjiText = kanjiText[1:]
            hiraganaString = hiraganaString[1:]
    
    if(leadingHiragana != ''):
        readings.append({'text': leadingHiragana})

    # remove any matching characters at the end of the strings
    trailingHiragana = ""
    if(not jUtils.isKanji(kanjiText[-1])):
        while(kanjiText[-1] == hiraganaString[-1] or 
              jUtils.convertKatakanaToHiragana(kanjiText[-1]) == hiraganaString[-1]):
            trailingHiragana = kanjiText[-1] + trailingHiragana
            kanjiText = kanjiText[0:-1]
            hiraganaString = hiraganaString[0:-1]
 
    if(jUtils.textOnlyIncludesKanji(kanjiText)):
        # no ambiguity possible, can confidently return full hiragana
        readings.append({'text': kanjiText, 'reading':hiraganaString})
    else:
        print(f'Unable to determine reading for {kanjiText}({hiraganaString})')
        readings += requestReadings(kanjiText, hiraganaString)

    if(trailingHiragana != ''):
        readings.append({'text': trailingHiragana})

    readingLookupTable[originalText] = readings

    return readings

# Breaks a full caption line into tokens
# tokens have a text component and a reading component
# when it is a kanji character
def normalizeCaption(caption):
    # The string returned by tagger.parse() where each line is a token
    # Each line has the token text, reading, and grammar information
    tokenizedString = tagger.parse(caption)
    tokenStrings = tokenizedString.split("\n")

    # The final elements are ["EOS", ""] and need to be removed
    tokenStrings = tokenStrings[:-2]

    tokensWithReadings = []
    for tokenString in tokenStrings:
        tokenInfo = tokenString.split("\t")
        originalText, _pronunciation, reading, *_rest = tokenInfo
        tokensWithReadings += getReading(originalText, jUtils.convertKatakanaToHiragana(reading))
    return tokensWithReadings

def readChunk(chunk):
    # The formatting of the vtt file can result 
    # in empty chunks, which must be filtered out
    if(len(chunk) < 2): 
        return

    # Example chunk formatting:
    # [
    #    7 // This first number is optional
    #   "00:03:12.480 --> 00:03:15.260",
    #   "日本では",
    #   "夏に"
    # ]
    # The number of lines varies but there is at least 1
    line1, line2, *captions = chunk
    timestamp = line1 if ":" in line1 else line2
    lines = []
    for caption in captions:
        lines.append(normalizeCaption(caption))

    return {
        'timestamp': float(timestamp[3:5]) * 60 + float(timestamp[6:12]),
        'lines': lines
    }

def main(videoId):
    vttFile = open(f'{videoId}.ja.vtt', 'r')
    vtt = vttFile.read()

    lines = vtt.split("\n\n")

    # The first line is header info about the vtt file format 
    lines.pop(0)
    # The last line is blank
    lines = lines[:-1]

    timestampedCaptionChunks = list(map(lambda line: line.split("\n"), lines))

    # Process each line
    fileData = {'captions': []}
    for chunk in timestampedCaptionChunks:
        fileData['captions'].append(readChunk(chunk))

    jsonFile = open(f'{videoId}.json', 'w')
    jsonFile.write(json.dumps(fileData, ensure_ascii=False, indent=2))
    jsonFile.close()


videoId = sys.argv[1]

print(f'Processing vtt file of {videoId}')
main(videoId)