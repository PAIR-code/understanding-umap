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
  import {
    getPoints,
    getDemoPreviewOverride,
    visualize
  } from "../../../shared/js/visualize";

  export let demo;
  export let onClick;
  export let selected;

  let canvas;

  const points = demo.previewOverride
    ? getDemoPreviewOverride(demo)
    : getPoints(demo);

  onMount(() => {
    visualize(points, canvas, null, null);
  });
</script>

<style>
  .demo-data {
    cursor: pointer;
    position: relative;
    font-size: 10px;
    line-height: 1.2em;
    box-sizing: border-box;
    float: left;
    margin: 2px;
    padding: 4px;
    width: calc(33% - 4px);
    background: white;
    border: 1px solid rgba(0, 0, 0, 0.1);
    border-radius: 4px;
    box-shadow: 0 0 3px rgba(0, 0, 0, 0.08);
  }

  @media (min-width: 480px) {
    .demo-data {
      width: calc(25% - 8px);
      padding: 8px;
      margin: 4px;
    }
  }
  @media (min-width: 768px) {
    .demo-data {
      width: calc(16.5% - 8px);
      padding: 8px;
      margin: 4px;
    }
  }
  .demo-data:hover {
    border: 1px solid rgba(0, 0, 0, 0.2);
  }
  .demo-data.selected::after {
    content: "";
    border: 2px solid rgba(70, 130, 180, 0.8);
    width: 100%;
    height: 100%;
    position: absolute;
    top: 0;
    left: 0;
    box-sizing: border-box;
    border-radius: 4px;
  }
  .demo-data:hover canvas {
    opacity: 1;
  }
  .demo-data canvas {
    width: 100%;
    opacity: 0.3;
  }
  .demo-data.selected canvas {
    opacity: 1;
  }
</style>

<div class="demo-data {selected ? 'selected' : ''}" on:click={onClick}>
  <canvas bind:this={canvas} width={150} height={150} />
</div>
