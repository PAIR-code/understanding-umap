// Reorder the labels in order to group similar categories.
const reorderedLabels = [0, 6, 2, 4, 3, 5, 7, 9, 1, 8];

function process(data) {
  const originalToReordered = {};
  reorderedLabels.forEach(
    (oldIndex, newIndex) => (originalToReordered[oldIndex] = newIndex)
  );
  data.labels = data.labels.map(index => {
    return originalToReordered[index];
  });

  const originalLabels = [...data.labelNames];
  data.labelNames = reorderedLabels.map(index => {
    return originalLabels[index];
  });
  return data;
}

export async function loadData() {
  const res = await fetch(`fmnist_tsne_vs_umap.json`);
  const json = await res.json();
  return process(json);
}
