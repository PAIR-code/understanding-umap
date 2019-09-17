import { decode, fromString } from "../../../shared/js/parse-binary";

export async function loadTSNE() {
  const res = await fetch(`mammoth_tsne_encoded.json`);
  const json = await res.json();

  const byteArray = fromString(json.tsne);
  const decoded = decode(byteArray, 20000, 10);
  const unzipped = [];
  for (let i = 0; i < decoded.length; i += 2) {
    unzipped.push([decoded[i], decoded[i + 1]]);
  }

  return unzipped;
}

async function loadProjections() {
  const res = await fetch(`mammoth_10k_encoded.json`);
  const mammoth = await res.json();

  const projections2D = mammoth.projections;
  const parsedProjections = {};

  Object.keys(projections2D).forEach(key => {
    const encoded = projections2D[key];
    const byteArray = fromString(encoded);
    const decoded = decode(byteArray, 20000, 10);
    const unzipped = [];
    for (let i = 0; i < decoded.length; i += 2) {
      unzipped.push([decoded[i], decoded[i + 1]]);
    }
    parsedProjections[key] = unzipped;
  });

  mammoth.projections = parsedProjections;

  return mammoth;
}

async function loadMammoth3D() {
  const res = await fetch(`mammoth_3d.json`);
  const mammoth3d = await res.json();
  return mammoth3d;
}

export async function loadData() {
  const output = {};
  await Promise.all([
    loadProjections().then(res => {
      output.projections = res.projections;
      output.labelOffsets = res.labelOffsets;
    }),
    loadMammoth3D().then(res => (output.mammoth3D = res))
  ]);
  return output;
}
