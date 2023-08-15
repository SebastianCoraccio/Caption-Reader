import re
import MeCab
import json

HIRAGANA_UNICODE_TABLE_WIDTH = 96

readingLookupTable = {}

tagger = MeCab.Tagger()

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

def getReading(originalText, hiraganaString):
    # text without kanji can be returned as is
    if(not textIncludesKanji(originalText)):
        return [{'text': originalText}]

    # ambiguous readings are verified by script user and stored for repeats
    if(readingLookupTable.get(originalText)):
        return readingLookupTable.get(originalText)

    readings = []

    # remove any matching characters at the start of the strings
    leadingHiragana = ""
    if(not isKanji(originalText[0])):
        while(originalText[0] == hiraganaString[0] or convertKatakanaToHiragana(originalText[0]) == hiraganaString[0]):
            leadingHiragana += originalText[0]
            originalText = originalText[1:]
            hiraganaString = hiraganaString[1:]
    
    if(leadingHiragana != ''):
        readings.append({'text': leadingHiragana})

    # remove any matching characters at the end of the strings
    trailingHiragana = ""
    if(not isKanji(originalText[-1])):
        while(originalText[-1] == hiraganaString[-1] or convertKatakanaToHiragana(originalText[-1]) == hiraganaString[-1]):
            trailingHiragana = originalText[-1] + trailingHiragana
            originalText = originalText[0:-1]
            hiraganaString = hiraganaString[0:-1]

    # no ambiguity possible, can confidently return full hiragana
    if(textOnlyIncludesKanji(originalText)):
        readings.append([{'text': originalText, 'reading':hiraganaString}])
        if(trailingHiragana != ''):
            readings.append({'text': trailingHiragana})
        return readings

    print('Unable to determine reading for', originalText)
    print('Please provide readings for each kanji group in the string')
    
    isRequestingReadings = False
    while(isRequestingReadings):
        print('Enter the kanji (enter nothing to stop entering readings)')
        kanji = input()
        if(kanji == ''):
            isRequestingReadings = False
            continue

        print('Enter its reading')
        reading = input()
        readings.append({'text':kanji, 'reading': reading})

    readingLookupTable[originalText] = readings

    # TODO Determine a suggestion by removing trailing verb or adjective endings

    # TODO I dont like this trailing check is duplicated above
    if(trailingHiragana != ''):
        readings.append({'text': trailingHiragana})

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
        tokensWithReadings.append(getReading(originalText, convertKatakanaToHiragana(reading)))
    return flatten2D(tokensWithReadings)

def flatten2D(array):
    acc = []
    for nestedArray in array:
        for item in nestedArray:
            acc.append(item)
    return acc
    

def test(actual, expected, testName):
    if(actual != expected):
        raise AssertionError(f'{testName} -  Expected value of {expected} did not match actual {actual}')

def flattenTests():
    test(flatten2D([[1,2],[3,4]]), [1,2,3,4], 'Flattens nested arrays')


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

def main():
    vttFile = open("summer-foods.ja.vtt", "r")
    vtt = vttFile.read()

    lines = vtt.split("\n\n")

    # The first line is header info about the vtt file format 
    lines.pop(0)

    timestampedCaptionChunks = list(map(lambda line: line.split("\n"), lines))

    # Process each line
    for chunk in timestampedCaptionChunks:
        chunkData = readChunk(chunk)
        print(chunkData)

main()

def getReadingTests():

    assert getReading('アパート','あぱーと') == [{'text': 'アパート'}], 'Non-kanji text'
    assert getReading('魚','さかな') == [{'text': '魚', 'reading': 'さかな'}], 'Single kanji words'
    assert getReading('今日','きょう') == [{'text': '今日','reading': 'きょう'}], 'Multi-kanji words'
    assert getReading('かき氷','かきごおり') == [{'text': '氷','reading': 'ごおり'}], 'Leading hiragana'
    assert getReading('暑い','あつい') == [{'text': '暑','reading': 'あつ'}], 'Trailing hiragana'
    assert getReading('夏バテ','なつばて') == [{'text': '夏','reading': 'なつ'}], 'Trailing katakana'

    readingLookupTable['話し'] = [{'text': '話','reading': 'reading is はな'}]
    assert getReading('話し','はなす') == [{'text': '話','reading': 'reading is はな'}], 'Required user input due to no match characters'

    readingLookupTable['食べ'] = [{'text': '食','reading': 'reading is た'}]
    assert getReading('食べ','たべる') == [{'text': '食','reading': 'reading is た'}], 'Required user input due to ambiguity'

    # TODO support this case without needing use input
    # assert getReading('食べ物','たべもの') == [['食','た'],['物','もの']], 'Multiple readings'




# getReadingTests()