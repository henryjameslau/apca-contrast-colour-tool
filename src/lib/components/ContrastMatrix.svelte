<script>
	import { getApcaContrast } from '$lib/utils/apca-utils';
	import ColorSwatch from './ColourSwatch.svelte';
	import chroma from 'chroma-js';

	export let colors = [];
	export let white = '#FFFFFF';

	let matrix = [];

	$: {
		// Re-calculate matrix whenever colors or white changes
		matrix = [];

		// Row for contrast with white
		const whiteRow = {
			label: 'vs background',
			values: colors.map((c) => ({
				color: c,
				contrast: getApcaContrast(c, white)
			}))
		};
		matrix.push(whiteRow);

		// Rows for contrast between colors
		colors.forEach((c1, i) => {
			const row = {
				label: `vs ${c1}`, // Or you could use an index/name for the color
				isColorRow: true, // Marker for styling color rows
				colorValue: c1, // Store the actual color value for the row header swatch
				values: colors.map((c2, j) => ({
					color: c2,
					background: c1, // c1 is the background
					contrast: getApcaContrast(c1, c2)
				}))
			};
			matrix.push(row);
		});
	}

	function getBestTextColor(backgroundColour) {
		if (chroma(backgroundColour).luminance() > 0.5) {
			return '#000000';
		} else {
			return '#ffffff';
		}
	}

	function getContrastClass(contrast) {
		const absContrast = Math.abs(contrast);
		if (absContrast >= 75) return 'contrast-super'; // Super accessible
		if (absContrast >= 60) return 'contrast-good'; // Good for larger text
		if (absContrast >= 45) return 'contrast-fair'; // Fair for regular text
		return 'contrast-poor'; // Poor contrast
	}

	function getContrastEmoji(contrast) {
		const absContrast = Math.abs(contrast);
		if (absContrast >= 60) return '✅'; // Good
		if (absContrast >= 45) return '⚠️'; // Fair (needs attention, especially for small text)
		return '❌'; // Poor
	}
</script>

<div class="contrast-matrix">
	<h2>Contrast Matrix</h2>
	<table>
		<thead>
			<tr>
				<th class="header-cell" style="background-color: {white}; color: {getBestTextColor(white)};"
					>Colour against</th
				>
				<!-- <th>White</th> -->
				{#each colors as color}
					<th
						class="header-cell"
						style="background-color: {white}; color: {getBestTextColor(white)};"
						><ColorSwatch {color} /></th
					>
				{/each}
			</tr>
		</thead>
		<tbody>
			<tr>
				<td><ColorSwatch color={white} /></td>
				<!-- <td class="contrast-value" style="background-color: {white};"></td> -->
				{#each matrix[0].values as { contrast, color }}
					<td
						class="contrast-value {getContrastClass(contrast)}"
						style="color: {getBestTextColor(white)}; background-color: {white};"
					>
						{contrast.toFixed(1)}{getContrastEmoji(contrast)}
					</td>
				{/each}
			</tr>
			{#each matrix.slice(1) as row, rowIndex}
				<tr>
					<td><ColorSwatch color={colors[rowIndex]} /></td>
					<!-- <td class="contrast-value {getContrastClass(row.values[rowIndex].contrast)}" style="color: {row.values[rowIndex].color}; background-color: {white};">
            {row.values[rowIndex].contrast.toFixed(1)}
          </td> -->
					{#each row.values as { contrast, color }, colIndex}
						{#if rowIndex === colIndex}
							<td class="contrast-value self-contrast" style="background-color: {color};"></td>
						{:else}
							<td
								class="contrast-value {getContrastClass(contrast)}"
								style="color: {getBestTextColor(colors[rowIndex])}; background-color: {colors[rowIndex]};"
							>
								{contrast.toFixed(1)}
								{getContrastEmoji(contrast)}
							</td>
						{/if}
					{/each}
				</tr>
			{/each}
		</tbody>
	</table>
	<p class="apca-note">
		APCA values are typically absolute; higher values indicate better contrast.
	</p>
	<p class="apca-note">✅ >60 Good for larger text</p>
	<p class="apca-note">⚠️ 45 minimum for lines</p>
	<p class="apca-note">❌ &lt;45 too low</p>
</div>

<style>
	.contrast-matrix table {
		width: 100%;
		border-collapse: collapse;
		margin-top: 20px;
	}
	.contrast-matrix th,
	.contrast-matrix td {
		border: 1px solid #eee;
		padding: 8px;
		text-align: center;
		font-size: 0.9em;
		position: relative; /* For emojis */
	}
	.contrast-matrix th {
		background-color: #f5f5f5;
	}
	.header-cell {
		font-weight: bold;
		text-shadow: 0 0 3px rgba(0, 0, 0, 0.2); /* Helps text stand out on varied backgrounds */
	}
	.row-header-cell {
		background-color: #f5f5f5;
		font-weight: bold;
	}
	.row-header-text {
		vertical-align: middle;
	}
	.contrast-value {
		font-weight: bold;
	}
	.contrast-super {
		background-color: #d4edda;
	} /* Greenish for good contrast */
	.contrast-good {
		background-color: #fff3cd;
	} /* Yellowish for moderate */
	.contrast-fair {
		background-color: #cfe2ff;
	} /* Light blue for fair */
	.contrast-poor {
		background-color: #f8d7da;
	} /* Reddish for poor contrast */
	.self-contrast {
		background-color: #ccc !important; /* Indicate self-contrast cell */
		color: #333 !important; /* Ensure readable text on this grey */
		font-size: 0.7em;
		padding: 0;
		line-height: 1;
	}
	.contrast-value span.emoji {
		position: absolute;
		top: 50%;
		left: 50%;
		transform: translate(-50%, -50%);
		font-size: 1.2em;
	}
	.apca-note {
		font-size: 0.85em;
		color: #666;
		margin-top: 15px;
		line-height: 1.4;
	}
</style>
