const { encode, decode } = require("./parse-binary");

const numbers = [];
const N_BITS = 10;
const COUNT = 1000;
for (let i = 0; i < COUNT; i++) {
  const num = Math.floor(Math.random() * 2 ** N_BITS);
  numbers.push(num);
}

const [encoded] = encode(numbers, N_BITS);
const [decoded] = decode(encoded, COUNT, N_BITS);

let isEqual = numbers.length === decoded.length;
for (let i = 0; i < encoded.length; i++) {
  if (numbers[i] !== decoded[i]) {
    isEqual = false;
  }
}
console.log(isEqual);
