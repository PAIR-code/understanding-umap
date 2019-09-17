<script>
  import { onMount } from "svelte";
  import { loadData, loadTSNE } from "../js/load-data";
  import Tsne2d from "./Tsne2d.svelte";
  import Umap2d from "./Umap2d.svelte";
  import Projection3d from "./Projection3d.svelte";

  let isLoaded = false;
  let colorIndices;
  let umapProjections;
  let tsneProjections;
  let mammoth3d;

  onMount(async () => {
    const data = await loadData();
    tsneProjections = await loadTSNE();
    isLoaded = true;
    colorIndices = data.colorIndices;
    umapProjections = data.projections;
    mammoth3d = data.mammoth3d;
  });
</script>

<style>
  .container {
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
    width: 100%;
  }
</style>

<div class="container">
  {#if isLoaded}
    <Tsne2d {colorIndices} projections={tsneProjections} />
    <Umap2d {colorIndices} projections={umapProjections} />
  {:else}
    <p>loading...</p>
  {/if}
</div>
