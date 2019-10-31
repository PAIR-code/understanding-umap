/* Copyright 2019 Google LLC All Rights Reserved.

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

import { decode, fromString } from "../../../shared/js/parse-binary";
import { N_BITS_TOY_COMPARISON } from "../../../shared/js/parameters";

const dataCache = new Map();

function process(compressed) {
  const processed = compressed.map((entry, index) => {
    Object.keys(entry).forEach(tsneOrUmap => {
      const dict = entry[tsneOrUmap];
      // Define an object with getter for lazy processing of the data for each key
      const object = {};
      Object.keys(dict).forEach(key => {
        Object.defineProperty(object, key, {
          get: function() {
            const cacheKey = `${tsneOrUmap}:${index}:${key}`;
            if (dataCache.has(cacheKey)) return dataCache.get(cacheKey);

            const encoded = dict[key];
            const { data, length, nDimensions, ranges } = encoded;
            const byteArray = fromString(atob(data));
            const decoded = decode(
              byteArray,
              nDimensions * length,
              N_BITS_TOY_COMPARISON
            );
            const unzipped = [];
            const [rangeX, rangeY] = ranges;
            const { min: minX, max: maxX } = rangeX;
            const { min: minY, max: maxY } = rangeY;
            const scale = 2 ** N_BITS_TOY_COMPARISON;
            for (let i = 0; i < decoded.length; i += 2) {
              const x = (decoded[i] / scale) * (maxX - minX) + minX;
              const y = (decoded[i + 1] / scale) * (maxY - minY) + minY;
              unzipped.push([x, y]);
            }

            dataCache.set(cacheKey, unzipped);
            return unzipped;
          },
          enumerable: true
        });
      });
      entry[tsneOrUmap] = object;
    });
    return entry;
  });

  return processed;
}

export async function loadData() {
  const res = await fetch(`toy_comparison_encoded.json`);
  const json = await res.json();
  return process(json);
}
