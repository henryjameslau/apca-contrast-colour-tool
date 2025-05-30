<script>
  export let color;
</script>

<div class="color-swatch" style="background-color: {color};"></div>

<style>
  .color-swatch {
    width: 25px;
    height: 25px;
    border: 1px solid #ccc;
    border-radius: 4px;
    display: inline-block;
    vertical-align: middle;
  }
</style>