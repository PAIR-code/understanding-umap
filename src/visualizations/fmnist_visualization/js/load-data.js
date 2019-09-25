export async function loadData() {
  const res = await fetch(`fmnist_tsne_vs_umap.json`);
  const json = await res.json();
  return json;
}
