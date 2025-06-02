<script>
	import { onMount } from 'svelte';
	import ColorInput from '$lib/components/ColourInput.svelte';
	import ContrastMatrix from '$lib/components/ContrastMatrix.svelte';
	import WcagContrastMatrix from '$lib/components/WcagContrastMatrix.svelte';
	import ChartPreview from '$lib/components/ChartPreview.svelte';

	// Initial colors (can be set by user or from an array)
	let colors = ['#007bff', '#27A0CC', '#871A5B', '#A8BD3A', '#F66068', '#003C57'];
	let backgroundColour = '#FFFFFF';

	let colorInputText = colors.join('\n'); // Initialize with current colors, one per line

	// Regular expression to validate hex colors (handles 3, 4, 6, 8 digit hex with or without '#')
	const hexColorRegex = /^#?([0-9A-Fa-f]{3}){1,2}$|^#?([0-9A-Fa-f]{4})$|^#?([0-9A-Fa-f]{8})$/;

	function isValidColor(colorString) {
		// Basic check for hex codes. For more robust validation (named colors, rgb/rgba),
		// you might need a more comprehensive library or parsing.
		return hexColorRegex.test(colorString.trim());
	}

	function handleColorChange(newColor, index) {
		colors[index] = newColor;
		colors = [...colors]; // Trigger reactivity
		colorInputText = colors.join('\n');
	}

	function addColor() {
		colors = [...colors, '#cccccc']; // Add a default gray color
		colorInputText = colors.join('\n'); // Update text input
	}

	function removeColor(index) {
		colors.splice(index, 1);
		colors = [...colors]; // Trigger reactivity
		colorInputText = colors.join('\n'); // Update text input
	}

	function loadColorsFromText() {
		const newColors = colorInputText
			.split(/[\n,;\s]+/) // Split by new line, comma, semicolon, or space
			.map((color) => color.trim().replace(/^['"]|['"]$/g, ''))//Remove surrounding quotes (single or double)
			.filter((color) => color && isValidColor(color)) // Filter out empty strings and invalid colors
			.map(e=>e.startsWith('#') ? e : `#${e}`);//Add '#' if missing for validation and consistency

		if (newColors.length > 0) {
			colors = newColors;
		} else {
			alert(
				'No valid colors found in the input. Please enter hex codes (e.g., #RRGGBB) separated by newlines, commas, or spaces.'
			);
			// Optionally reset to a default if input is invalid
			// colors = ['#cccccc'];
		}
		colorInputText = colors.join('\n'); // Normalize text input to valid colors only
	}
</script>

<main>
	<h1>APCA Color Palette Chooser</h1>

	<section class="color-selection">
		<h2>1. Select Your Colors</h2>

		<div class="color-array-input">
			<h3>Set Colors from Text Array</h3>
			<textarea
				bind:value={colorInputText}
				placeholder="Enter hex colors, one per line or separated by commas (e.g., #FF0000, #00FF00)"
				rows="8"
				on:blur={loadColorsFromText}
			></textarea>
            <br/>
			<button on:click={loadColorsFromText} class="load-button">Load Colors from Text</button>
			<p class="input-tip">
				(Only valid hex codes will be loaded. Example: `#007bff`, `28a745`, `#F00`)
			</p>
		</div>

		<div class="individual-color-inputs">
			<h3>Individual Color Adjustments</h3>
			<div class="color-inputs-list">
				{#each colors as color, index (index)}
					<div class="color-input-row">
						<ColorInput
							bind:color={colors[index]}
							on:change={(e) => handleColorChange(e.detail, index)}
						/>
						<button on:click={() => removeColor(index)} disabled={colors.length <= 1}>Remove</button
						>
					</div>
				{/each}
				<button on:click={addColor}>Add New Color</button>
			</div>
		</div>

		<div class="white-color-input">
			<h3>Background for Contrast</h3>
			<ColorInput bind:color={backgroundColour} />
		</div>
	</section>

	<section class="contrast-analysis">
		<h2>2. Contrast Analysis (APCA)</h2>
		<ContrastMatrix {colors} white={backgroundColour} />
		<WcagContrastMatrix {colors} white={backgroundColour} />
	</section>

	<section class="chart-preview-section" style="background-color:{backgroundColour};">
		<h2>3. Chart Previews</h2>
		<ChartPreview {colors} />
	</section>
</main>

<style>
	main {
		max-width: 1000px;
		margin: 0 auto;
		padding: 20px;
		font-family: sans-serif;
	}
	section {
		background-color: #f9f9f9;
		border-radius: 8px;
		padding: 20px;
		margin-bottom: 30px;
		box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
	}
	h1,
	h2,
	h3 {
		color: #333;
		margin-bottom: 15px;
	}
	.color-array-input {
    margin-bottom: 25px;
    padding-bottom: 15px;
    border-bottom: 1px solid #eee;
  }
  .color-array-input textarea {
    width: 100%;
    padding: 10px;
    border: 1px solid #ccc;
    border-radius: 4px;
    box-sizing: border-box; /* Include padding in width */
    font-family: monospace;
    font-size: 0.9em;
  }
  .color-array-input .load-button {
    margin-top: 10px;
  }
  .input-tip {
    font-size: 0.85em;
    color: #666;
    margin-top: 5px;
  }

  .individual-color-inputs {
    margin-top: 20px;
  }
  .color-inputs-list {
    display: flex;
    flex-wrap: wrap;
    gap: 15px;
    margin-bottom: 20px;
  }
  .color-input-row {
    display: flex;
    align-items: center;
    gap: 10px;
  }
  button {
    padding: 8px 15px;
    border: none;
    border-radius: 4px;
    background-color: #007bff;
    color: white;
    cursor: pointer;
    font-size: 0.9em;
  }
  button:hover {
    background-color: #0056b3;
  }
  button:disabled {
    background-color: #ccc;
    cursor: not-allowed;
  }
  .white-color-input {
    margin-top: 20px;
    padding-top: 15px;
    border-top: 1px solid #eee;
  }  
</style>
