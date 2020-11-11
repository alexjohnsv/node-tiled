const sharp = require('sharp');
const path = require('path');

const args = require('minimist')(process.argv.slice(2));

const files = args._;
const margin = args.m || 0;
const fileOut = args.o || 'o/tileset.png';
const tile_width = args.w || 16;
const tile_height = args.h || 16;


const numberOfFiles = files.length;

if (numberOfFiles === 0) {
  return;
}

const w = (numberOfFiles * tile_width) + (margin * (numberOfFiles - 1));
const h = tile_height

const images = files.map((file, index) => {
  let left = index * tile_width;
  if (index > 0) {
    left += margin;
  }
  return {
    input: file,
    left: left,
    top: 0,
  }
})

const image = sharp({
  create: {
    width: w,
    height: h,
    channels: 4,
    background: { r: 0, g: 0, b: 0, alpha: 0 }
  }
})
.composite(images);

image.toFile(fileOut);

if (args.r) {

  const images_index_ref = files.map((file, index) => {
    return {
      input: Buffer.from(createSvg(index)),
      left: index * tile_width,
      top: 0,
    }
  });

  const parts = path.parse(fileOut);
  parts.name = parts.name + '--reference';
  parts.base = '';

  const fileOutReference = path.format(parts);

  const ref = image
                .clone()
                .composite([...images, ...images_index_ref])
                .toFile(fileOutReference);
}


function createSvg(number) {
  return `<svg height="${tile_width}" width="${tile_height}"><text x="0" y="15" fill="red">${number}</text></svg>`;
}
