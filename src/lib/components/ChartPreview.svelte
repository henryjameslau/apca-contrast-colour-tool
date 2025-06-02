<script>
  import { onMount } from "svelte";
  import { Plot, Line, BarX, BarY, Dot, GridX, AxisY, AxisX } from "svelteplot";

  export let colors = ["red", "green", "blue"]; // Default trial colors

  let lineData = [];
  let barData = [];
  let scatterData = [];

  const categories = ["A", "B", "C", "D"];

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

  $:{
    // Line Data: array of objects {x, y, color}
    lineData = colors.map(color =>
      Array.from({ length: 10 }, (_, x) => ({
        x,
        y: random(10, 100)
      }))
    );

    // Bar Data: array of objects {category, value, color}
    barData = colors.flatMap(color =>
      categories.map(category => ({
        category,
        value: random(10, 100),
        color
      }))
    );

    // Scatter Data: array of objects {x, y, color}
    scatterData = colors.flatMap(color =>
      Array.from({ length: 30 }, () => ({
        x: Math.random() * 100,
        y: Math.random() * 100,
        color,
        category:categories[Math.floor(Math.random()*4)]
      }))
    );
  }


$:console.log(barData)
</script>

<h2>Line Plot</h2>
<Plot grid>
  {#each colors as colour,i}
    <Line x='x' y='y' data={lineData[i]} stroke={colour} strokeWidth="3px"/>
  {/each}
</Plot>

<h2>Stacked Bar Chart</h2>
<Plot>
<BarX data={barData} x='value' y='category' fill="color"/>
</Plot>

<h2>Scatter Plot</h2>
<Plot grid>
  <Dot data={scatterData} x='x' y='y' fill='color' r={4} stroke='white' strokeWidth='1px' symbol={(d)=>symbolMap[d.category]}/>
</Plot>

<h2>Clustered column</h2>
<Plot
    x={{ label: ' ' }}
    y={{ label: '' }}
    fx={{
        axis: 'bottom',
        axisProps: { fontWeight: 'bold', tickFontSize: 1 },
        axisOptions: { dy: 20 }
    }}>
    <AxisX></AxisX>
    <BarY
        data={barData}
        x="color"
        y="value"
        dx={0}
        fx="category"
        fill="color"
        inset={-2} />
</Plot>