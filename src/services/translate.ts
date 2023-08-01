import {DEEPL_AUTH_KEY} from '../../config';

function translateText(text: string) {
  let formdata = new FormData();
  formdata.append('text', text);
  formdata.append('source_lang', 'ja');
  formdata.append('target_lang', 'en_US');
  const params = new URLSearchParams({
    text,
    target_lang: 'en-US',
    auth_key: DEEPL_AUTH_KEY,
  });

  return fetch(`https://api-free.deepl.com/v2/translate?${params}`, {
    method: 'POST',
  })
    .then(response => response.json())
    .then(data => {
      return data.translations.map(translation => translation.text).join();
    })
    .catch(err => {
      console.error(err);
    });
}

export async function translate(text: string) {
  const result = await translateText(text);
  return result;
}
