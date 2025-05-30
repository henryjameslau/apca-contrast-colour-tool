<script>
  import { onMount } from "svelte";
  import { Plot, Line, BarX, groupY, stackX, Dot } from "svelteplot";

  export let colors = ["red", "green", "blue"]; // Default trial colors

  let lineData = [];
  let barData = [];
  let scatterData = [];

  const categories = ["A", "B", "C", "D"];

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
        color
      }))
    );
  }

</script>

<h2>Line Plot</h2>
<Plot grid>
  {#each colors as colour,i}
    <Line x='x' y='y' data={lineData[i]} stroke={colour}/>
  {/each}
</Plot>

<h2>Stacked Bar Chart</h2>
<Plot>
<BarX data={barData} x='value' y='category' fill="color"/>
</Plot>

<h2>Scatter Plot</h2>
<Plot grid>
  <Dot data={scatterData} x='x' y='y' fill='color' />
</Plot>
