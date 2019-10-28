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
