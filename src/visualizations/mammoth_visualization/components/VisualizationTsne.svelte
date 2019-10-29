<script>
  /* Copyright 2019 Google Inc. All Rights Reserved.

  Licensed under the Apache License, Version 2.0 (the "License");
  you may not use this file except in compliance with the License.
  You may obtain a copy of the License at

      http://www.apache.org/licenses/LICENSE-2.0

  Unless required by applicable law or agreed to in writing, software
  distributed under the License is distributed on an "AS IS" BASIS,
  WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
  See the License for the specific language governing permissions and
  limitations under the License.
  ==============================================================================*/
  
  import { onMount } from "svelte";
  import { loadData, loadTSNE } from "../js/load-data";
  import Tsne2d from "./Tsne2d.svelte";
  import Umap2d from "./Umap2d.svelte";
  import Projection3d from "./Projection3d.svelte";
  import { times } from "../js/times";

  let isLoaded = false;
  let colorIndices;
  let umapProjections;
  let tsneProjections;
  let mammoth3d;
  let hoveredPointIndex = -1;


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
    width: 100%;
  }
</style>

<div class="container">
  {#if isLoaded}
    <Tsne2d
      {colorIndices}
      on:hover={e => hoveredPointIndex = e.detail}
      {hoveredPointIndex}
      projections={tsneProjections}
      title={'2D t-SNE projection'}
      times={times.tsne} />
    <Umap2d
      {colorIndices}
      on:hover={e => hoveredPointIndex = e.detail}
      {hoveredPointIndex}
      projections={umapProjections}
      title={'2D UMAP projection'}
      times={times.umap} />
  {:else}
    <p>loading...</p>
  {/if}
</div>
