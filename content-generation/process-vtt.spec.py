def test(actual, expected, testName):
    if(actual != expected):
        raise AssertionError(f'{testName} -  Expected value of {expected} did not match actual {actual}')

def getReadingTests():

    test(
        getReading('アパート','あぱーと'),
        [{'text': 'アパート'}],
        'Non-kanji text'
    )
    test(
        getReading('魚','さかな'),
        [{'text': '魚', 'reading': 'さかな'}],
        'Single kanji words'
    )
    test(
        getReading('今日','きょう'),
        [{'text': '今日','reading': 'きょう'}],
        'Multi-kanji words'
    )
    test(
        getReading('かき氷','かきごおり'),
        [{'text': 'かき'}, {'text': '氷','reading': 'ごおり'}],
        'Leading hiragana'
    )
    test(
        getReading('暑い','あつい'),
        [{'text': '暑','reading': 'あつ'}, {'text': 'い'}],
        'Trailing hiragana'
    )
    test(
        getReading('夏バテ','なつばて'),
        [{'text': '夏','reading': 'なつ'},{'text': 'バテ'}],
        'Trailing katakana'
    )

    readingLookupTable['話し'] = [{'text': '話','reading': 'reading is はな'}]
    test(
        getReading('話し','はなす'),
        [{'text': '話','reading': 'reading is はな'}],
        'Required user input due to no match characters'
    )

    readingLookupTable['食べ'] = [{'text': '食','reading': 'reading is た'}]
    test(
        getReading('食べ','たべる'),
        [{'text': '食','reading': 'reading is た'}],
        'Required user input due to ambiguity'
    )

    # TODO support this case without needing use input
    # test(getReading('食べ物','たべもの'),[['食','た'],['物','もの']], 'Multiple readings')
