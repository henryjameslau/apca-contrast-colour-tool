<script>
  import { createEventDispatcher } from 'svelte';
  
  import ColorPicker from 'svelte-awesome-color-picker';


  export let color = '#ff0000'; // Default color

  const dispatch = createEventDispatcher();

  function handleColorChange(event) {
    color = event.detail.hex; // Adjust based on your color picker's event structure
    dispatch('change', color);
  }
</script>

<div class="color-input">
  <input type="text" bind:value={color} on:change={() => dispatch('change', color)} />
  <ColorPicker bind:hex={color} on:change={handleColorChange} />
  <!-- <div class="color-swatch" style="background-color: {color};"></div> -->
</div>

<style>
  .color-input {
    display: flex;
    align-items: center;
    gap: 10px;
  }
  .color-swatch {
    width: 30px;
    height: 30px;
    border: 1px solid #ccc;
    border-radius: 4px;
  }
</style>