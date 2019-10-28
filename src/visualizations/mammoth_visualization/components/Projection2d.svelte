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
  
  import { afterUpdate, onMount } from "svelte";
  import Slider from "../../../shared/components/Slider.svelte";
  import { COLORS } from "../js/colors";
  import { loadData } from "../js/load-data";
  import { Tween } from "../js/tween";
  import { render2d } from "../js/render";

  let canvas;
  let tween;

  export let colorIndices;
  export let projection;

  const width = 1024;
  const height = 1024;

  const tweenCallback = (projection, isActive, percent) => {
    const dimensions = { width, height };
    render2d(canvas, dimensions, projection, colorIndices);
  };

  onMount(() => {
    tween = new Tween(projection, tweenCallback);
  });

  afterUpdate(() => {
    tween.beginTween(projection);
  });
</script>

<style>
  canvas {
    background-color: #fff;
    width: 100%;
    margin-bottom: 20px;
  }
</style>

<canvas bind:this={canvas} width={1024} height={1024} />
