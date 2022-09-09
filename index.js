import fs from 'node:fs';
import * as cheerio from 'cheerio';
import download from 'download';
import fetch from 'node-fetch';

async function getMemes() {
  try {
    const response = await fetch(
      'https://memegen-link-examples-upleveled.netlify.app',
    );
    const body = await response.text();
    const $ = cheerio.load(body);
    const imageURL = [];
    $('img', body).each(function () {
      const image = $(this).attr('src');
      imageURL.push(image);
    });
    const filePath = fs.mkdirSync(`./memes`);
    const firstTenMemes = imageURL.slice(0, 10);
    let counter = 1;
    firstTenMemes.forEach((url) => {
      download(url, `${filePath}/0${counter}.jpg`)
        .then(() => console.log('Download successful'))
        .catch((err) => console.log(err));
      counter++;
    });
    return body;
  } catch (err) {
    console.log(err);
  }
}

await getMemes();
