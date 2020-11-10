const sharp = require('sharp');

const args = require('minimist')(process.argv.slice(2));

const files = args._;

const margin = args.m || 0;

const fileOut = args.o || 'o/tileset.png';

const numberOfFiles = files.length;

const w = (numberOfFiles * 16) + (margin * (numberOfFiles - 1));
const h = 16;

const images = files.map((file, index) => {
  let left = index * 16;
  if (index > 0) {
    left += margin;
  }
  return {
    input: file,
    left: left,
    top: 0,
  }
})

sharp({
  create: {
    width: w,
    height: h,
    channels: 4,
    background: { r: 0, g: 0, b: 0, alpha: 0 }
  }
})
.composite(images)
.toFile(fileOut);