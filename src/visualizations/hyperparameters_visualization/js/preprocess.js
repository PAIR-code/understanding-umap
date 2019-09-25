import { allDemos as demos } from "../../../shared/js/toy-configs";
import { getPoints } from "../../toy_visualization/js/visualize";
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

const nNeighborsOptions = [5, 10, 15, 20, 30];
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
