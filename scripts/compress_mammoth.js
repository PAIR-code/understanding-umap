const fs = require("fs");
const path = require("path");
const btoa = require("btoa");

const PUBLIC_DIR = "../public/";

const { encode, toString } = require("../src/shared/js/parse-binary");
const {
  TSNE_MAMMOTH_PERPLEXITIES,
  N_BITS_MAMMOTH
} = require("../src/shared/js/parameters");
const mammothData = require("../raw_data/mammoth_umap.json");
const mammothTSNE = require("../raw_data/mammoth_tsne.json");
const mammoth3d = mammothData["3d"];

const labels = mammothData.labels;
const labelIndices = labels
  .map((label, index) => {
    return { label, index };
  })
  .sort((a, b) => a.label - b.label);

const labelCounts = {};
labelIndices.forEach(({ label }) => {
  labelCounts[label] = labelCounts[label] || 0;
  labelCounts[label] += 1;
});

// Process and encode the UMAP projections
const encodedUMAP = {};
Object.keys(mammothData.projections).forEach(key => {
  const projection = mammothData.projections[key];

  const output = [];
  labelIndices.forEach(({ index }) => {
    const point = projection[index];
    output.push(point[0], point[1]);
  });

  const encoded = encode(output, N_BITS_MAMMOTH);
  encodedUMAP[key] = btoa(toString(encoded));
});

// Sort the 3D points as well
const mammoth3DSorted = [];
labelIndices.forEach(({ index }) => {
  const point = mammoth3d[index];
  mammoth3DSorted.push([point[1], point[2], point[0]]);
});

// Process and encode the tsne projections
const encodedTSNE = {};
TSNE_MAMMOTH_PERPLEXITIES.forEach(p => {
  const key = `p=${p}`;
  const projection = mammothTSNE.projections[key];

  const output = [];
  labelIndices.forEach(({ index }) => {
    const point = projection[index];
    output.push(point[0], point[1]);
  });

  const encoded = encode(output, N_BITS_MAMMOTH);
  encodedTSNE[key] = btoa(toString(encoded));
});

const labelOffsets = Object.keys(labelCounts)
  .map(index => {
    return { index, count: labelCounts[index] };
  })
  .sort((a, b) => a.index - b.index)
  .map(item => item.count);

const encodedUMAPOutput = {
  projections: encodedUMAP,
  labelOffsets
};
const s = JSON.stringify(encodedUMAPOutput);
fs.writeFileSync(
  path.join(__dirname, PUBLIC_DIR, "mammoth_10k_encoded.json"),
  s
);
fs.writeFileSync(
  path.join(__dirname, PUBLIC_DIR, "mammoth_3d.json"),
  JSON.stringify(mammoth3DSorted)
);
fs.writeFileSync(
  path.join(__dirname, PUBLIC_DIR, "mammoth_tsne_encoded.json"),
  JSON.stringify(encodedTSNE)
);
