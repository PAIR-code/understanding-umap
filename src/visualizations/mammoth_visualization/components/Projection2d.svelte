<script>
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
