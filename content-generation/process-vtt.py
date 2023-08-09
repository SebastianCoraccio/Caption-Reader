import re
import MeCab
import json

HIRAGANA_UNICODE_TABLE_WIDTH = 96

tagger = MeCab.Tagger()

def isKanji(character):
  return re.match("[\u4e00-\u9faf]|[\u3400-\u4dbf]|々", character)


def textIncludesKanji(text):
    for char in text: 
        if(isKanji(char)):
           return True
    return False

def convertKatakanaToHiragana(katakana):
    acc = ""
    for character in katakana:
        acc += chr(ord(character) - HIRAGANA_UNICODE_TABLE_WIDTH)
    return acc

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
            print(originalText, reading, convertKatakanaToHiragana(reading))
            

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
    
