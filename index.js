const sharp = require('sharp');
const path = require('path');

const args = require('yargs')(process.argv.slice(2))
  .usage('Usage: $0 -w resources/1.png resources/2.png -w [num] -h [num] -o [output file]')
  .demandCommand(1)
  .demandOption(['w', 'h', 'o'])
  .default('m', 0)
  .describe('m', 'Sets the margin between tiles')
  .describe('w', 'Tile width')
  .describe('h', 'Tile height')
  .describe('o', 'Output file')
  .option('r')
  .describe('r', 'Create a numbered reference image')
  .default('r', false)
  .boolean('r')
  .argv;

const files = args._;
const margin = args.m;
const fileOut = args.o;
const tile_width = args.w;
const tile_height = args.h;

const numberOfFiles = files.length;

const w = (numberOfFiles * tile_width) + (margin * (numberOfFiles - 1));
const h = tile_height

const images = files.map((file, index) => {
  let left = index * tile_width;
  if (index > 0) {
    left += margin * index;
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

  const images_numbered = images.map((image, index) => {
    return {
      input: Buffer.from(createSvg(index)),
      left: image.left,
      top: image.top,
    }
  });

  const parts = path.parse(fileOut);
  parts.name = parts.name + '--reference';
  parts.base = '';

  const fileOutReference = path.format(parts);

  const ref = image
                .clone()
                .composite([...images, ...images_numbered])
                .toFile(fileOutReference);
}


function createSvg(number) {
  return `<svg height="${tile_width}" width="${tile_height}"><text x="0" y="15" fill="red">${number}</text></svg>`;
}
