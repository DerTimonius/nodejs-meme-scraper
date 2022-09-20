import fs from 'node:fs';
import * as cheerio from 'cheerio';
import fetch from 'node-fetch';

const filePath = './memes';
try {
  if (!fs.existsSync(filePath)) {
    fs.mkdirSync(filePath);
  }
} catch (err) {
  console.log(err);
}

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
    const firstTenMemes = imageURL.slice(0, 10);
    let counter = 1;
    firstTenMemes.map(async (url) => {
      await fetch(url).then(
        (res) =>
          res.body.pipe(
            fs.createWriteStream(
              `${filePath}/${counter < 10 ? '0' + counter : counter}.jpg`,
            ),
          ),
        console.log('Download successful!'),
      );
      counter++;
    });
  } catch (err) {
    console.log(err);
  }
}

function createMeme(top, bottom, name) {
  try {
    const url = `https://api.memegen.link/images/${name}/${top}/${bottom}.jpg`;
    const folder = fs.mkdirSync('./custom_memes', { recursive: true });
    fetch(url)
      .then((res) =>
        res.body.pipe(fs.createWriteStream(`${folder}/${name}.jpg`)),
      )
      .catch((err) => console.log(err));
    console.log('Meme created!');
  } catch (err) {
    console.log(err);
  }
}

if (process.argv.length === 2) {
  await getMemes();
} else {
  const top = String(process.argv[2].toLowerCase().split(' ').join('_'));
  const bottom = String(process.argv[3].toLowerCase().split(' ').join('_'));
  const name = String(process.argv[4].toLowerCase().split(' ').join('_'));
  createMeme(top, bottom, name);
}
