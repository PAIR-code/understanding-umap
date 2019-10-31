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

import demos from "../../toy_comparison_visualization/js/demos";
import { getPoints } from "../../../shared/js/visualize";
import { UMAP } from "umap-js";
import fs from "fs";
import path from "path";

demos.forEach(demo => {
  const dimensionsOption = demo.options.find(
    option => option.name === "Dimensions"
  );
  if (dimensionsOption) {
    dimensionsOption.start = Math.floor(dimensionsOption.max / 2);
  }
});

const nNeighborsOptions = [5, 15, 30, 50, 100];
const minDistOptions = [0, 0.01, 0.05, 0.1, 0.5, 1.0];

const output = [];

for (let demo of demos) {
  console.log(demo.name);
  const entry = {};
  const points = getPoints(demo).map(p => {
    return p.coords;
  });
  for (let nNeighbors of nNeighborsOptions) {
    for (let minDist of minDistOptions) {
      const umap = new UMAP({
        nNeighbors,
        minDist,
        nEpochs: 500,
        nComponents: 2
      });
      const projection = umap.fit(points);
      const key = `nNeighbors=${nNeighbors},minDist=${minDist}`;
      console.log(key);
      entry[key] = projection;
    }
  }
  output.push(entry);
}

const json = JSON.stringify(output);
fs.writeFileSync(path.join(__dirname, "./preprocessed.json"), json);
