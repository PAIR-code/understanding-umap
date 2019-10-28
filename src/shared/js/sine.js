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

import { Random } from "./random";

const random = new Random(112);
const constrain = (n, max, min = 0) => Math.max(Math.min(n, max), min);
const getRandom = x => Math.floor(x * random.nextFloat());
const getRandomPoint = () => ({
  x: getRandom(width),
  y: getRandom(height)
});
const getSinePoint = (width, height, pointRadius) => {
  let x = getRandom(width);
  let y = (Math.sin((x / width) * 6 * Math.PI) * height) / 4 + height / 2;
  y = y + getRandom(height / 5) * (random.nextFloat() > 0.5 ? 1 : -1);
  return {
    x: constrain(x, width - pointRadius, pointRadius),
    y: constrain(y, height - pointRadius, pointRadius)
  };
};

export function makeSine(nPoints, dimensions, pointRadius = 5) {
  const { width, height } = dimensions;

  const points = [];
  for (let i = 0; i < nPoints; i++) {
    const point = getSinePoint(width, height, pointRadius);
    points.push({ ...point, index: i });
  }

  return points;
}
