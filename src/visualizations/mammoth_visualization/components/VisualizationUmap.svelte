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
  import { loadData } from "../js/load-data";
  import Umap2d from "./Umap2d.svelte";
  import Projection3d from "./Projection3d.svelte";

  let isLoaded = false;
  let colorIndices;
  let projections;
  let mammoth3d;
  let hoveredPointIndex = -1;

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
    width: 100%;
  }
</style>

<div class="container">
  {#if isLoaded}
    <Projection3d 
      {colorIndices}  
      {mammoth3d}
      on:hover={e => hoveredPointIndex = e.detail}
      {hoveredPointIndex}
      title={'Original 3D Data'} />
    <Umap2d 
      {colorIndices} 
      {projections} 
      on:hover={e => hoveredPointIndex = e.detail}
      {hoveredPointIndex}
      title={'2D UMAP Projection'} />
  {:else}
    <p>loading...</p>
  {/if}
</div>
