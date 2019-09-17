class BitArray {
  constructor(length) {
    length = Math.ceil(length / 32);
    this.backingArray = new Uint32Array(length);
    this.length = length;
  }
  get(n) {
    return (this.backingArray[(n / 32) | 0] & (1 << n % 32)) !== 0;
  }
  on(n) {
    this.backingArray[(n / 32) | 0] |= 1 << n % 32;
  }
  off(n) {
    this.backingArray[(n / 32) | 0] &= ~(1 << n % 32);
  }
  toggle(n) {
    this.backingArray[(n / 32) | 0] ^= 1 << n % 32;
  }
  forEach(callback) {
    this.backingArray.forEach((number, container) => {
      const max =
        container == this.backingArray.length - 1 ? this.length % 32 : 32;
      for (let x = 0; x < max; x++) {
        callback((number & (1 << x)) !== 0, 32 * container + x);
      }
    });
  }
}

module.exports.encode = function encode(numbers, nBits) {
  const count = numbers.length;
  const encodeBitArray = new BitArray(count * nBits);

  for (let i = 0; i < numbers.length; i++) {
    const number = numbers[i];
    for (let j = 0; j < nBits; j++) {
      const bitIndex = i * nBits + j;
      if ((number & (2 ** j)) !== 0) encodeBitArray.on(bitIndex);
    }
  }

  const byteArrayLength = Math.ceil((count * nBits) / 8);
  const byteArray = new Uint8Array(byteArrayLength);
  for (let i = 0; i < byteArray.length; i++) {
    let number = 0;
    for (let j = 0; j < 8; j++) {
      const bitIndex = i * 8 + j;
      const bit = encodeBitArray.get(bitIndex);
      number += bit ? 2 ** j : 0;
    }
    byteArray[i] = number;
  }
  return byteArray;
};

module.exports.decode = function(byteArray, count, nBits) {
  const totalBits = count * nBits;
  const parseBitArray = new BitArray(totalBits);
  for (let i = 0; i < byteArray.length; i++) {
    const byte = byteArray[i];
    for (let j = 0; j < 8; j++) {
      const bitIndex = i * 8 + j;
      if (byte & (2 ** j)) parseBitArray.on(bitIndex);
    }
  }

  let number = 0;
  const parsed = [];
  parseBitArray.forEach((bit, index) => {
    const bitIndex = index % nBits;
    if (bitIndex === 0 && index !== 0) {
      parsed.push(number);
      number = 0;
    }
    number += bit ? 2 ** bitIndex : 0;
  });
  parsed.push(number);
  return parsed;
};

module.exports.toString = function toString(arr) {
  return String.fromCharCode.apply(null, arr);
};

module.exports.fromString = function fromString(str) {
  return Uint8Array.from(str, x => x.charCodeAt(0));
};
