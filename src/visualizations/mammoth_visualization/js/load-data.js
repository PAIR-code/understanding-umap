import { decode, fromString } from "../../../shared/js/parse-binary";
import { N_BITS_MAMMOTH } from "../../../shared/js/parameters";

function parseProjections(encodedProjections) {
  const parsedProjections = {};
  Object.keys(encodedProjections).forEach(key => {
    const encoded = encodedProjections[key];
    const byteArray = fromString(encoded);
    const decoded = decode(byteArray, 20000, N_BITS_MAMMOTH);
    const unzipped = [];
    for (let i = 0; i < decoded.length; i += 2) {
      unzipped.push([decoded[i], decoded[i + 1]]);
    }
    parsedProjections[key] = unzipped;
  });
  return parsedProjections;
}

let tsneData = null;
let tsnePromise = null;

async function _loadTSNE() {
  const res = await fetch(`mammoth_tsne_encoded.json`);
  const json = await res.json();

  tsneData = parseProjections(json);
  return tsneData;
}

export async function loadTSNE() {
  if (tsneData) return tsneData;
  if (!tsnePromise) tsnePromise = _loadTSNE();
  return tsnePromise;
}

let umapData = null;
let umapPromise = null;

async function _loadUmap() {
  const res = await fetch(`mammoth_10k_encoded.json`);
  const mammoth = await res.json();

  const parsedProjections = parseProjections(mammoth.projections);
  mammoth.projections = parsedProjections;
  umapData = mammoth;
  return umapData;
}

export async function loadUmap() {
  if (umapData) return umapData;
  if (!umapPromise) umapPromise = _loadUmap();
  return umapPromise;
}

let mammoth3dData = null;
let mammoth3dPromise = null;

async function _loadMammoth3D() {
  const res = await fetch(`mammoth_3d.json`);
  const mammoth3d = await res.json();
  mammoth3dData = mammoth3d;
  return mammoth3d;
}

export async function loadMammoth3D() {
  if (mammoth3dData) return mammoth3dData;
  if (!mammoth3dPromise) mammoth3dPromise = _loadMammoth3D();
  return mammoth3dPromise;
}

let colorIndices = null;
let colorIndicesPromise = null;

async function _loadColorIndices() {
  const umap = await loadUmap();
  const colorOffsets = umap.labelOffsets;

  colorIndices = new Uint8Array(10000);
  let colorIndex = -1;
  let nColorPoints = 0;
  for (let i = 0; i < colorIndices.length; i++) {
    if (i >= nColorPoints) {
      colorIndex += 1;
      nColorPoints += colorOffsets[colorIndex];
    }
    colorIndices[i] = colorIndex;
  }

  return colorIndices;
}

export async function loadColorIndices() {
  if (colorIndices) return colorIndices;
  if (!colorIndicesPromise) colorIndicesPromise = _loadColorIndices();
  return colorIndicesPromise;
}

export async function loadData() {
  const output = {};
  await Promise.all([
    loadUmap().then(res => (output.projections = res.projections)),
    loadColorIndices().then(res => (output.colorIndices = res)),
    loadMammoth3D().then(res => (output.mammoth3d = res))
  ]);

  return output;
}
