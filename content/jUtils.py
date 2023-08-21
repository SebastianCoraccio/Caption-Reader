import re

HIRAGANA_UNICODE_TABLE_WIDTH = 96

def isKanji(character):
  return re.match("[\u4e00-\u9faf]|[\u3400-\u4dbf]|々", character)

def isKatakana(character):
    return re.match(
      "[\u30A1-\u30FA\u30FD-\u30FF\u31F0-\u31FF\u32D0-\u32FE\u3300-\u3357\uFF66-\uFF6F\uFF71-\uFF9D]", character
    )   

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
        if(not isKatakana(character)):
            acc += character
        else:
            acc += chr(ord(character) - HIRAGANA_UNICODE_TABLE_WIDTH)
    return acc
