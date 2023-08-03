const fs = require('fs');

function isKanjiOrNumberOrKatakana(character) {
  return isKanji(character) || isNumber(character) || isKatakana(character);
}

function isKatakana(character) {
  return Boolean(
    character.match(
      /[\u30A1-\u30FA\u30FD-\u30FF\u31F0-\u31FF\u32D0-\u32FE\u3300-\u3357\uFF66-\uFF6F\uFF71-\uFF9D]/,
    ),
  );
}

function isNumber(character) {
  return Boolean(character.match(/[0-9]/));
}

function isKanji(character) {
  return Boolean(character.match(/[\u4e00-\u9faf]|[\u3400-\u4dbf]|々/));
}

function isKanjiOrNumber(character) {
  return isKanji(character) || isNumber(character);
}

function processVtt(vttString) {
  // TODO add dictionary lookup to generate furigana
  const readingMap = {};

  const parts = vttString
    .split('\n\n')
    .slice(1) // removes header info
    .map(line => line.split('\n'))
    .filter(lineParts => lineParts.length > 1)
    .map(lineParts => {
      const [timestamp, ...lines] = lineParts;

      const splitLines = lines.map(line => {
        const splitLine = [...line].reduce((acc, character) => {
          const previous = acc[acc.length - 1];

          if (
            previous &&
            isKanjiOrNumber(previous.text) === isKanjiOrNumber(character)
          ) {
            acc[acc.length - 1].text += character;
            if (readingMap && readingMap[acc[acc.length - 1].text]) {
              acc[acc.length - 1].reading =
                readingMap[acc[acc.length - 1].text];
            }
          } else {
            if (readingMap && readingMap[character]) {
              acc.push({text: character, reading: readingMap[character]});
            } else {
              acc.push({text: character});
            }
          }

          return acc;
        }, []);

        return splitLine;
      });

      return {
        timestamp:
          Number(timestamp.slice(3, 5)) * 60 + Number(timestamp.slice(6, 12)),
        lines: splitLines,
      };
    });
  fs.writeFile(
    'vtt.json',
    JSON.stringify(parts, null, 2),
    'utf8',
    function (err) {
      if (err) {
        return console.log(err);
      }
    },
  );
  return parts;
}

module.exports = {
  processVtt,
};
