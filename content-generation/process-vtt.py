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

def findFirstHiragana(text):
    index = 0
    for character in text:
        
        index += 1
        return 
    return "", -1

def getReading(kanjiString, hiraganaString):

    # ambiguous readings are verified by script user and stored for repeats
    if(readingLookupTable.get(kanjiString)):
        return readingLookupTable.get(kanjiString)

    # remove any matching characters at the start of the strings
    if(not isKanji(kanjiString[0])):
        while(kanjiString[0] == hiraganaString[0] or convertKatakanaToHiragana(kanjiString[0]) == hiraganaString[0]):
            kanjiString = kanjiString[1:]
            hiraganaString = hiraganaString[1:]
    
    # remove any matching characters at the end of the strings
    if(not isKanji(kanjiString[-1])):
        while(kanjiString[-1] == hiraganaString[-1] or convertKatakanaToHiragana(kanjiString[-1]) == hiraganaString[-1]):
            kanjiString = kanjiString[0:-1]
            hiraganaString = hiraganaString[0:-1]

    # no ambiguity possible, can confidently return full hiragana
    if(textOnlyIncludesKanji(kanjiString)):
        return [[kanjiString, hiraganaString]]


    # split on kanji

    # starts and ends with kanji

    # No match found
    # TODO Request reading from user
    print('no match for [', kanjiString, '],[', hiraganaString, ']')

    # Determine a suggestion by removing trailing verb or adjective endings


    return ""

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

    for tokenString in tokenStrings:
        tokenInfo = tokenString.split("\t")
        originalText, _pronunciation, reading, *_rest = tokenInfo
        if(textIncludesKanji(originalText)):
            # TODO Get kanji reading from token reading
            hiraganaReading = convertKatakanaToHiragana(reading)
            reading = getReading(originalText, hiraganaReading)
            

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
    for caption in captions:
        normalizeCaption(caption)


def main():
    vttFile = open("summer-foods.ja.vtt", "r")
    vtt = vttFile.read()

    lines = vtt.split("\n\n")

    # The first line is header info about the vtt file format 
    lines.pop(0)

    timestampedCaptionChunks = list(map(lambda line: line.split("\n"), lines))

    # Process each line
    for chunk in timestampedCaptionChunks:
        readChunk(chunk)

main()

def getReadingTests():

    assert getReading('魚','さかな') == [['魚','さかな']], 'Single kanji words'
    assert getReading('今日','きょう') == [['今日','きょう']], 'Multi-kanji words'
    assert getReading('かき氷','かきごおり') == [['氷','ごおり']], 'Leading hiragana'
    assert getReading('暑い','あつい') == [['暑','あつ']], 'Trailing hiragana'
    assert getReading('夏バテ','なつばて') == [['夏','なつ']], 'Trailing katakana'
    assert getReading('食べ物','たべもの') == [['食','た'],['物','もの']], 'Multiple readings'

    readingLookupTable['話し'] = [['話', 'reading is はな']]
    assert getReading('話し','はなす') == [['話','reading is はな']], 'Required user input due to no match characters'

    readingLookupTable['食べ'] = [['食', 'reading is た']]
    assert getReading('食べ','たべる') == [['食','reading is た']], 'Required user input due to ambiguity'



getReadingTests()