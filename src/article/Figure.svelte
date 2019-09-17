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
    border-top: 1px solid rgba(0, 0, 0, 0.1);
    margin-top: 36px;
    padding: 36px 0 0 0;
  }

  .figure-container {
    max-width: 1000px;
  }
</style>

<figure>
  <div class="figure-container">
    <slot />
  </div>
</figure>
