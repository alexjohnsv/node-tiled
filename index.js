const sharp = require('sharp');

const args = require('minimist')(process.argv.slice(2));

const files = args._;

const numberOfFiles = files.length;

const w = numberOfFiles * 16;
const h = 16;

const images = files.map((file, index) => {
  return {
    input: file,
    left: index * 16,
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
.toFile(args.o);