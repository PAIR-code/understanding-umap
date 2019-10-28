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

import { distanceMatrix } from "../../../shared/js/toy-configs";
import { getPoints } from "../../../shared/js/visualize";
import { UMAP } from "umap-js";
import { TSNE } from "../../../shared/js/tsne";
import demos from "../js/demos";
import fs from "fs";
import path from "path";

const nNeighborsOptions = [3, 5, 15, 30, 50, 100];
const perplexityOptions = [3, 5, 15, 30, 50, 100];
const minDist = 0.1;

const output = [];

for (let demo of demos) {
  console.log(demo.name);
  const points = getPoints(demo).map(p => {
    return p.coords;
  });

  const umapEntry = {};
  for (let nNeighbors of nNeighborsOptions) {
    const umap = new UMAP({
      nNeighbors,
      minDist,
      nEpochs: 500,
      nComponents: 2
    });
    const projection = umap.fit(points);
    const key = `nNeighbors=${nNeighbors}`;
    console.log("UMAP", key);
    umapEntry[key] = projection;
  }

  const tsneEntry = {};
  for (let perplexity of perplexityOptions) {
    const tsne = new TSNE({
      perplexity
    });
    const dists = distanceMatrix(points);
    tsne.initDataDist(dists);
    for (let i = 0; i < 1000; i++) {
      tsne.step();
    }
    const projection = tsne.getSolution();
    const key = `perplexity=${perplexity}`;
    console.log("tSNE", key);
    tsneEntry[key] = projection;
  }
  output.push({ umap: umapEntry, tsne: tsneEntry });
}

const json = JSON.stringify(output);
fs.writeFileSync(path.join(__dirname, "./preprocessed.json"), json);
