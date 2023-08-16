import sys
import re
import MeCab
import json

print(sys.argv)

HIRAGANA_UNICODE_TABLE_WIDTH = 96
readingLookupTable = {}
tagger = MeCab.Tagger()

# --- Helpers -------------------------------------------------------

def isKanji(character):
  return re.match("[\u4e00-\u9faf]|[\u3400-\u4dbf]|々", character)

def textIncludesKanji(text):
    for char in text: 
        if(isKanji(char)):
           return True
    return False

def textOnlyIncludesKanji(text): 
    for char in text: 
        if(not isKanji(char)):
           return False
    return True

def convertKatakanaToHiragana(katakana):
    acc = ""
    for character in katakana:
        acc += chr(ord(character) - HIRAGANA_UNICODE_TABLE_WIDTH)
    return acc

# -------------------------------------------------------------------

# Assumes kanjiText begins with kanji
def requestReadings(kanjiText, hiraganaString):
    readings = []
    while(kanjiText != ""):
        # separate chunk of kanji from string
        kanji = ""
        while(kanjiText != "" and isKanji(kanjiText[0])):
            kanji += kanjiText[0]
            kanjiText = kanjiText[1:]

        # request reading for kanji chunk
        print(f'Enter reading for {kanji} ({hiraganaString})')
        reading = input()
        readings.append({'text':kanji, 'reading': reading})

        nonKanji = ""
        while(kanjiText != "" and not isKanji(kanjiText[0])):
            nonKanji += kanjiText[0]
            kanjiText = kanjiText[1:]

        if(nonKanji != ""):
            readings.append({'text':nonKanji,})

    return readings
        

def getReading(kanjiText, hiraganaString):
    originalText = kanjiText
    # text without kanji can be returned as is
    if(not textIncludesKanji(kanjiText)):
        return [{'text': kanjiText}]

    # ambiguous readings are verified by script user and stored for repeats
    if(readingLookupTable.get(originalText)):
        return readingLookupTable.get(originalText)

    readings = []

    # remove any matching characters at the start of the strings
    leadingHiragana = ""
    if(not isKanji(kanjiText[0])):
        while(kanjiText[0] == hiraganaString[0] or convertKatakanaToHiragana(kanjiText[0]) == hiraganaString[0]):
            leadingHiragana += kanjiText[0]
            kanjiText = kanjiText[1:]
            hiraganaString = hiraganaString[1:]
    
    if(leadingHiragana != ''):
        readings.append({'text': leadingHiragana})

    # remove any matching characters at the end of the strings
    trailingHiragana = ""
    if(not isKanji(kanjiText[-1])):
        while(kanjiText[-1] == hiraganaString[-1] or convertKatakanaToHiragana(kanjiText[-1]) == hiraganaString[-1]):
            trailingHiragana = kanjiText[-1] + trailingHiragana
            kanjiText = kanjiText[0:-1]
            hiraganaString = hiraganaString[0:-1]

    # no ambiguity possible, can confidently return full hiragana
    if(textOnlyIncludesKanji(kanjiText)):
        readings.append({'text': kanjiText, 'reading':hiraganaString})
        if(trailingHiragana != ''):
            readings.append({'text': trailingHiragana})
        return readings

    print(f'Unable to determine reading for {kanjiText}({hiraganaString})')

    readings += requestReadings(kanjiText, hiraganaString)
    
    # TODO I dont like this trailing check is duplicated above
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
    # The final elements are ["EOS", ""] and that needs to be removed
    tokenStrings = tokenStrings[:-2]

    tokensWithReadings = []
    for tokenString in tokenStrings:
        tokenInfo = tokenString.split("\t")
        originalText, _pronunciation, reading, *_rest = tokenInfo
        tokensWithReadings += getReading(originalText, convertKatakanaToHiragana(reading))
    return tokensWithReadings


def readChunk(chunk):
    # The formatting of the vtt file can result 
    # in empty chunks, which must be filtered
    if(len(chunk) < 2): 
        return

    # Example chunk formatting:
    # [
    #   "00:03:12.480 --> 00:03:15.260",
    #   "日本では",
    #   "夏に"
    # ]
    # The number of lines varies but there is at least 1
    timestamp, *captions = chunk
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