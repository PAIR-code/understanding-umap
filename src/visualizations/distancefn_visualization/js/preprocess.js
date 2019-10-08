import { distanceMatrix } from "../../../shared/js/toy-configs";
import { getPoints } from "../../../shared/js/visualize";
import { UMAP } from "umap-js";
import demos from "../js/demos";
import fs from "fs";
import path from "path";

const nNeighborsOptions = [3, 5, 15, 30, 50, 100];
const minDist = 0.1;

const output = [];

const manhattanDistance = (a, b) => {
  let distance = 0;
  for (let i = 0; i < a.length; i++) {
    distance += Math.abs(a[i] - b[i]);
  }
  return distance;
};

for (let demo of demos) {
  console.log(demo.name);
  const points = getPoints(demo).map(p => {
    return p.coords;
  });

  const euclideanEntry = {};
  for (let nNeighbors of nNeighborsOptions) {
    const umap = new UMAP({
      nNeighbors,
      minDist,
      nEpochs: 500,
      nComponents: 2
    });
    const projection = umap.fit(points);
    const key = `nNeighbors=${nNeighbors}`;
    console.log("Euclidean", key);
    euclideanEntry[key] = projection;
  }

  const manhattanEntry = {};
  for (let nNeighbors of nNeighborsOptions) {
    const umap = new UMAP({
      nNeighbors,
      minDist,
      nEpochs: 500,
      nComponents: 2,
      distanceFn: manhattanDistance
    });
    const projection = umap.fit(points);
    const key = `nNeighbors=${nNeighbors}`;
    console.log("Manhattan", key);
    manhattanEntry[key] = projection;
  }

  output.push({ euclidean: euclideanEntry, manhattan: manhattanEntry });
}

const json = JSON.stringify(output);
fs.writeFileSync(path.join(__dirname, "./preprocessed.json"), json);
