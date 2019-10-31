<script>
  /* Copyright 2019 Google LLC All Rights Reserved.

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

  import { afterUpdate, onMount, createEventDispatcher } from "svelte";
  import { getPoints, visualize } from "../../../shared/js/visualize";

  const dispatch = createEventDispatcher();

  export let points;
  export let onClick;
  export let selected;
  export let hoveredPointIndex = -1;
  export let selectable = true;
  export let highlighted = false;
  export let size = 150;

  function handleMousemove(){
    var scale = size/canvas.offsetWidth
    var mx = event.layerX*scale;
    var my = event.layerY*scale;

    if (!points && points.length) return;

    var minDist = Infinity;
    var minIndex = 0;
    points.forEach((d, i) => {
      var dx = d.px - mx;
      var dy = d.py - my;

      var dist = dx*dx + dy*dy;
      if (dist < minDist){
        minDist = dist;
        minIndex = i;
      }
    })

    dispatch('hover', minIndex);
  }

  let canvas;
  let svg;

  onMount(() => {
    visualize(points, canvas, null, null);
  });

  let prevPoints = null;
  afterUpdate(() => {
    if (points == prevPoints) return;
    prevPoints = points;
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
  .demo-data.non-selectable {
    cursor: default;
    box-shadow: none;
    margin: -1px !important;
    position: relative;
    left: 4px;
    top: 4px;
    border-radius: 0px;
    padding: 0px;
  }

  @media (min-width: 480px) {
    .demo-data {
      padding: 8px;
      margin: 4px;
    }
  }
  @media (min-width: 768px) {
    .demo-data {
      padding: 8px;
      margin: 4px;
    }
  }
  .demo-data:hover {
    border: 1px solid rgba(0, 0, 0, 0.2);
  }
  .demo-data.non-selectable:hover {
    border: 1px solid rgba(0, 0, 0, 0.1);
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
  .demo-data svg{
    width: 100%;
    height: 100%;
    position: absolute;
    top: 0px;
    left: 0px;
    pointer-events: none;
  }
  .demo-data.highlighted canvas {
    opacity: 1;
  }
  .demo-data.selected canvas {
    opacity: 1;
  }
</style>

<div
  class="demo-data {selected ? 'selected' : ''}
  {highlighted ? 'highlighted' : ''}
  {selectable ? '' : 'non-selectable'}"
  on:click={onClick}>
  <canvas bind:this={canvas} width={size} height={size} on:mousemove={handleMousemove} />
  <svg bind:this={svg} viewBox="0 0 {size} {size}">
    {#if points[hoveredPointIndex] && points[hoveredPointIndex].px}
      <circle
        r='5' fill='none' stroke='#000' stroke-width='2' 
        opacity='{hoveredPointIndex > -1 ? 1 : 0}'
        cx={points[hoveredPointIndex].px}
        cy={points[hoveredPointIndex].py}>
      </circle>
    {/if}
  </svg>
</div>
