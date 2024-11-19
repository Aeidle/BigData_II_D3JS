// Application des conventions de marges pour D3.
var margin = { top: 20, right: 20, bottom: 20, left: 20 };
var width = 450 - margin.left - margin.right,
  height = 300 - margin.top - margin.bottom;

// Données à afficher.
var bleu = [
  86, 51, 42, 29, 89, 56, 73, 37, 81, 57, 54, 74, 72, 85, 56, 60, 72, 75, 57,
  89, 53, 77, 97, 77, 60, 86, 86, 60, 53, 77, 74, 50, 64, 90, 51, 90, 73, 86,
  55, 74, 64, 57, 75, 66, 58, 79, 55, 65, 62, 68, 20, 50, 82, 76, 79, 71, 63,
  78, 69, 76, 53, 91, 92, 83, 47, 72, 91, 80, 51, 71, 64, 75, 78, 49, 92, 52,
  82, 78, 57, 41, 28,
];
var rouge = [56, 77, 74, 50, 64, 90, 51, 90, 67, 98, 100, 54, 65];
var vert = [62, 68, 50, 11, 63, 18, 69, 16, 53];

// Affichage de données avec un diagramme de boîte.
function moustache(svg, donnees, y, h, strokeC, fillC, x) {
  // Calculate statistics
  const q1 = d3.quantile(donnees.sort(d3.ascending), 0.25); // First quartile (25th percentile)
  const median = d3.quantile(donnees, 0.5); // Median (50th percentile)
  const q3 = d3.quantile(donnees, 0.75); // Third quartile (75th percentile)
  const iqr = q3 - q1; // Interquartile range
  const min = Math.max(d3.min(donnees), q1 - 1.5 * iqr); // Lower whisker
  const max = Math.min(d3.max(donnees), q3 + 1.5 * iqr); // Upper whisker

  // Draw the whiskers
  svg
    .append("line")
    .attr("x1", x(min))
    .attr("x2", x(max))
    .attr("y1", y)
    .attr("y2", y)
    .attr("stroke", strokeC);

  // draw the min line
  svg
    .append("line")
    .attr("x1", x(min))
    .attr("x2", x(min))
    .attr("y1", y - h / 4)
    .attr("y2", y + h / 4)
    .attr("stroke", strokeC);

  // draw the max line
  svg
    .append("line")
    .attr("x1", x(max))
    .attr("x2", x(max))
    .attr("y1", y - h / 4)
    .attr("y2", y + h / 4)
    .attr("stroke", strokeC);

  // Draw the box
  svg
    .append("rect")
    .attr("x", x(q1))
    .attr("width", x(q3) - x(q1))
    .attr("y", y - h / 2)
    .attr("height", h)
    .attr("stroke", strokeC)
    .attr("fill", fillC)
    .attr("stroke-width", 2);

  // Draw the median
  svg
    .append("line")
    .attr("x1", x(median))
    .attr("x2", x(median))
    .attr("y1", y - h / 2)
    .attr("y2", y + h / 2)
    .attr("stroke", strokeC)
    .attr("stroke-width", 2);
}

// Load the chart on window load
d3.select(window).on("load", function () {
  // Set up the SVG canvas
  var svg = d3
    .select("body")
    .append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
    .append("g")
    .attr("transform", `translate(${margin.left},${margin.top})`);

  // Define the scale
  var x = d3
    .scaleLinear()
    .domain([0, 100]) // Data range
    .range([0, width]); // Pixel range

  // Draw the x-axis
  svg.append("g").attr("transform", `translate(0,0)`).call(d3.axisBottom(x));

  // Draw the box plots
  moustache(svg, bleu, 50, 30, "blue", "lightblue", x);
  moustache(svg, vert, 130, 30, "green", "lightgreen", x);
  moustache(svg, rouge, 210, 30, "red", "pink", x);
});
