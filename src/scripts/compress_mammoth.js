const fs = require("fs");
const path = require("path");

const { encode, toString } = require("../shared/js/parse-binary");
const mammothData = require("../raw_data/mammoth_10k.json");
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

const encodedProjections = {};
Object.keys(mammothData.projections).forEach(key => {
  const projection = mammothData.projections[key];

  const output = [];
  labelIndices.forEach(({ index }) => {
    const point = projection[index];
    output.push(point[0], point[1]);
  });

  const encoded = encode(output, 10);
  encodedProjections[key] = toString(encoded);
});

// Sort the 3D points as well
const mammoth3DSorted = [];
labelIndices.forEach(({ index }) => {
  const point = mammoth3d[index];
  mammoth3DSorted.push([point[1], point[2], point[0]]);
});

// Sort the tsne points as well
const mammothTSNESorted = [];
labelIndices.forEach(({ index }) => {
  const point = mammothTSNE[index];
  mammothTSNESorted.push(point[0], point[1]);
});
const mammothTSNEString = toString(encode(mammothTSNESorted, 10));

const labelOffsets = Object.keys(labelCounts)
  .map(index => {
    return { index, count: labelCounts[index] };
  })
  .sort((a, b) => a.index - b.index)
  .map(item => item.count);

const encodedOutput = {
  projections: encodedProjections,
  labelOffsets
};
const s = JSON.stringify(encodedOutput);
fs.writeFileSync(path.join(__dirname, `../public/mammoth_10k_encoded.json`), s);
fs.writeFileSync(
  path.join(__dirname, `../public/mammoth_3d.json`),
  JSON.stringify(mammoth3DSorted)
);
fs.writeFileSync(
  path.join(__dirname, `../public/mammoth_tsne_encoded.json`),
  JSON.stringify({ tsne: mammothTSNEString })
);
