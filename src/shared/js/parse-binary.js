/* Copyright 2019 Google Inc. All Rights Reserved.

  Licensed under the Apache License, Version 2.0 (the "License");
  you may not use this file except in compliance with the License.
  You may obtain a copy of the License at

      http://www.apache.org/licenses/LICENSE-2.0

  Unless required by applicable law or agreed to in writing, software
  distributed under the License is distributed on an "AS IS" BASIS,
  WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
  See the License for the specific language governing permissions and
  limitations under the License.
  ==============================================================================*/

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

  const parsed = [];
  for (let index = 0; index < count; index++) {
    let number = 0;
    for (let bitIndex = 0; bitIndex < nBits; bitIndex++) {
      const absBitIndex = index * nBits + bitIndex;
      if (parseBitArray.get(absBitIndex)) number += 2 ** bitIndex;
    }
    parsed.push(number);
  }
  return parsed;
};

module.exports.toString = function toString(arr) {
  return String.fromCharCode.apply(null, arr);
};

module.exports.fromString = function fromString(str) {
  return Uint8Array.from(str, x => x.charCodeAt(0));
};
