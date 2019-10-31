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

  import { afterUpdate, onMount, createEventDispatcher } from "svelte";
  import Slider from "../../../shared/components/Slider.svelte";
  import { COLORS } from "../js/colors";
  import { loadData } from "../js/load-data";
  import { Tween } from "../js/tween";
  import { render2d } from "../js/render";

  const dispatch = createEventDispatcher();

  let canvas;
  let svg;
  let tween;

  export let colorIndices;
  export let projection;
  export let hoveredPointIndex = -1;
  export let size = 1024;

  function handleMousemove() {
    var scale = size / canvas.offsetWidth;
    var mx = event.layerX * scale;
    var my = event.layerY * scale;

    if (!colorIndices && colorIndices.length) return;

    var minDist = Infinity;
    var minIndex = 0;
    projection.forEach((d, i) => {
      var dx = d[0] - mx;
      var dy = d[1] - my;

      var dist = dx * dx + dy * dy;
      if (dist < minDist) {
        minDist = dist;
        minIndex = i;
      }
    });

    dispatch("hover", minIndex);
  }

  function handleMouseout() {
    dispatch("hover", -1);
  }

  const tweenCallback = (projection, isActive, percent) => {
    const dimensions = { width: size, height: size };
    render2d(canvas, dimensions, projection, colorIndices);
  };

  onMount(() => {
    tween = new Tween(projection, tweenCallback);
  });

  // Skip rerender if projection hasn't changed
  // Not sure if there's a more svelte way of doing this
  let lastProjection = null;
  afterUpdate(() => {
    if (projection == lastProjection) return;
    lastProjection = projection;
    tween.beginTween(projection);
  });
</script>

<style>
  canvas {
    background-color: #fff;
    width: 100%;
    margin-bottom: 20px;
  }

  svg {
    position: absolute;
    top: 0px;
    left: 0px;
    pointer-events: none;
  }

  .container {
    width: 100%;
    position: relative;
  }
</style>

<div class="container">
  <canvas
    bind:this={canvas}
    width={size}
    height={size}
    on:mousemove={handleMousemove}
    on:mouseout={handleMouseout} />

  <svg bind:this={svg} viewBox="0 0 {size} {size}">
    <text>{projection[hoveredPointIndex]}</text>
    {#if projection[hoveredPointIndex] && projection[hoveredPointIndex][0]}
      <circle
        r="10"
        fill="none"
        stroke="#000"
        stroke-width="3"
        opacity={hoveredPointIndex > -1 ? 1 : 0}
        cx={projection[hoveredPointIndex][0]}
        cy={projection[hoveredPointIndex][1]} />
    {/if}
  </svg>
</div>
