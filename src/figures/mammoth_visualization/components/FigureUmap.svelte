<script>
  import { onMount } from "svelte";
  import { loadData } from "../js/load-data";
  import Umap2d from "./Umap2d.svelte";
  import Projection3d from "./Projection3d.svelte";

  let isLoaded = false;
  let colorIndices;
  let projections;
  let mammoth3d;

  onMount(async () => {
    const data = await loadData();
    isLoaded = true;
    colorIndices = data.colorIndices;
    projections = data.projections;
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
    <Projection3d {colorIndices} {mammoth3d} />
    <Umap2d {colorIndices} {projections} />
  {:else}
    <p>loading...</p>
  {/if}
</div>
