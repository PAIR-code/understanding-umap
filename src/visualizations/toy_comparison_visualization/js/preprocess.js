import { distanceMatrix } from "../../toy_visualization/js/demo-configs";
import { getPoints } from "../../toy_visualization/js/visualize";
import { UMAP } from "umap-js";
import { TSNE } from "../../../shared/js/tsne";
import demos from "../js/demos";
import fs from "fs";
import path from "path";

const nNeighborsOptions = [2, 5, 15, 30, 50, 100];
const perplexityOptions = [2, 5, 15, 30, 50, 100];
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
