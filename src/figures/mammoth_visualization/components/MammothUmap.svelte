<script>
  import { onMount } from "svelte";
  import { loadData } from "../js/data";
  import Projection2D from "./Projection2D.svelte";
  import Projection3D from "./Projection3D.svelte";

  let isLoaded = false;
  let labelOffsets;
  let projections2D;
  let mammoth3D;

  onMount(async () => {
    const data = await loadData();
    isLoaded = true;
    labelOffsets = data.labelOffsets;
    projections2D = data.projections;
    mammoth3D = data.mammoth3D;
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
    <Projection3D {labelOffsets} {mammoth3D} />
    <Projection2D {labelOffsets} {projections2D} />
  {:else}
    <p>loading...</p>
  {/if}
</div>
