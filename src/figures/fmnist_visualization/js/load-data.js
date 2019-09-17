export async function loadData() {
  const res = await fetch(`fmnist.json`);
  const json = await res.json();
  return json;
}
