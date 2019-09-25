import { distanceMatrix } from "../../toy_visualization/js/demo-configs";
import { getPoints } from "../../toy_visualization/js/visualize";
import { UMAP } from "umap-js";
import { TSNE } from "../../../shared/js/tsne";
import demos from "../js/demos";
import fs from "fs";
import path from "path";

// export const optionsOverrides = [
//   {
//     name: "Grid",
//     options: [
//       {
//         name: "Points Per Side",
//         start: 20
//       }
//     ]
//   },
//   {
//     name: "Two Clusters",
//     options: [
//       {
//         name: "Points Per Cluster",
//         start: 100
//       },
//       {
//         name: "Dimensions",
//         start: 50
//       }
//     ]
//   },
//   {
//     name: "Three Clusters",
//     options: [
//       {
//         name: "Points Per Cluster",
//         start: 100
//       },
//       {
//         name: "Dimensions",
//         start: 50
//       }
//     ]
//   },
//   {
//     name: "Two Different-Sized Clusters",
//     options: [
//       {
//         name: "Points Per Cluster",
//         start: 100
//       },
//       {
//         name: "Dimensions",
//         start: 50
//       },
//       {
//         name: "Scale",
//         start: 5
//       }
//     ]
//   },
//   {
//     name: "Two Long Linear Clusters",
//     options: [
//       {
//         name: "Points Per Cluster",
//         start: 100
//       }
//     ]
//   },
//   {
//     name: "Cluster In Cluster",
//     options: [
//       {
//         name: "Points Per Cluster",
//         start: 100
//       },
//       {
//         name: "Dimensions",
//         start: 50
//       }
//     ]
//   },
//   {
//     name: "Circle (Evenly Spaced)",
//     options: [
//       {
//         name: "Number Of Points",
//         start: 200
//       }
//     ]
//   },
//   {
//     name: "Circle (Randomly Spaced)",
//     options: [
//       {
//         name: "Number Of Points",
//         start: 200
//       }
//     ]
//   },
//   {
//     name: "Gaussian Cloud",
//     options: [
//       {
//         name: "Number Of Points",
//         start: 250
//       },
//       {
//         name: "Dimensions",
//         start: 50
//       }
//     ]
//   },
//   {
//     name: "Ellipsoidal Gaussian Cloud",
//     options: [
//       {
//         name: "Number Of Points",
//         start: 250
//       },
//       {
//         name: "Dimensions",
//         start: 50
//       }
//     ]
//   },
//   {
//     name: "Trefoil Knot",
//     options: [
//       {
//         name: "Number Of Points",
//         start: 200
//       }
//     ]
//   },
//   {
//     name: "Linked Rings",
//     options: [
//       {
//         name: "Number Of Points",
//         start: 200
//       }
//     ]
//   },
//   {
//     name: "Unlinked Rings",
//     options: [
//       {
//         name: "Number Of Points",
//         start: 200
//       }
//     ]
//   },
//   {
//     name: "Orthogonal Steps",
//     options: [
//       {
//         name: "Number Of Points",
//         start: 200
//       }
//     ]
//   },
//   {
//     name: "Random Walk",
//     options: [
//       {
//         name: "Number Of Points",
//         start: 200
//       },
//       {
//         name: "Dimension",
//         start: 100
//       }
//     ]
//   },
//   {
//     name: "Random Jump",
//     options: [
//       {
//         name: "Number Of Points",
//         start: 200
//       },
//       {
//         name: "Dimension",
//         start: 100
//       }
//     ]
//   },
//   {
//     name: "Equally Spaced",
//     options: [
//       {
//         name: "Number Of Points",
//         start: 200
//       }
//     ]
//   },
//   {
//     name: "Uniform Distribution",
//     options: [
//       {
//         name: "Number Of Points",
//         start: 200
//       },
//       {
//         name: "Dimensions",
//         start: 10
//       }
//     ]
//   }
// ];

// demos.forEach((demo, i) => {
//   demo.options = demo.options.map((option, j) => {
//     option.start = optionsOverrides[i].options[j].start;
//     return option;
//   });
// });

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
