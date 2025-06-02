<script>
	import { onMount } from 'svelte';
	import { Plot, Line, BarX, BarY, Dot, GridX, AxisY, AxisX } from 'svelteplot';

	export let colors = ['red', 'green', 'blue']; // Default trial colors

	let lineData = [];
	let barData = [];
	let scatterData = [];

	let startingLineData = [];
	let startingBarData = [];
	let startingScatterData = [];
  

	const categories = ['A', 'B', 'C', 'D'];

	const symbolMap = {
		A: 'circle',
		B: 'square',
		C: 'triangle',
		D: 'diamond2'
	};

	// Helper to generate random data
	function random(min, max) {
		return Math.floor(Math.random() * (max - min + 1)) + min;
	}

	onMount(() => {
		// Line
		startingLineData = Array.from({ length: colors.length }, () =>
			Array.from({ length: 10 }, (_, x) => ({
				x,
				y: random(10, 100)
			}))
		);

		// Bar
		startingBarData = colors.flatMap(() =>
			categories.map((category) => ({
				category,
				value: random(10, 100)
			}))
		);

		// Scatter
		startingScatterData = Array.from({ length: 30 }, () => ({
			x: Math.random() * 100,
			y: Math.random() * 100,
			category: categories[Math.floor(Math.random() * categories.length)]
		}));
	});

	// Apply colors reactively
	$: lineData = startingLineData.map(
		(series, i) => series.map((point) => ({ ...point })) // clone
	);

	$: barData = startingBarData.map((item, i) => ({
		...item,
		color: colors[Math.floor(i / categories.length)]
	}));

	$: scatterData = startingScatterData.map((item, i) => ({
		...item,
		color: colors[i % colors.length]
	}));

  $:console.log(barData)
</script>

<h2>Line Plot</h2>
<Plot grid>
	{#each colors as colour, i}
		<Line x="x" y="y" data={lineData[i]} stroke={colour} strokeWidth="3px" />
	{/each}
</Plot>

<h2>Stacked Bar Chart</h2>
<Plot>
	<BarX data={barData} x="value" y="category" fill="color" />
</Plot>

<h2>Scatter Plot</h2>
<Plot grid>
	<Dot
		data={scatterData}
		x="x"
		y="y"
		fill="color"
		r={4}
		stroke="white"
		strokeWidth="1px"
		symbol={(d) => symbolMap[d.category]}
	/>
</Plot>
