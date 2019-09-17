<script>
  import Slider from "../../../shared/components/Slider.svelte";

  export let options;
  export let value;
  const { name, min, max } = options;
  const step = options.step || 1;
</script>

<style>
  .slider-container {
    margin: 10px 0;
  }
</style>

<div>
  <span>{name}</span>
  <span>{value}</span>
  <div class="slider-container">
    <Slider {min} {max} {step} bind:value />
  </div>
</div>
