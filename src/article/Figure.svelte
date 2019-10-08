<script>

</script>

<style>
  figure {
    width: 110%;
    margin-left: -5%;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    margin-top: 18px;
    padding: 18px 0 0 0;
  }

  .figure-container {
    max-width: 1000px;
    width: 100%;
  }

  caption {
    margin: 20px 0;
    font-style: italic;
    width: 80%;
    font-size: 13px;
  }
</style>

<figure>
  <div class="figure-container">
    <slot />
  </div>
  <caption>
    <slot name="caption" />
  </caption>
</figure>
