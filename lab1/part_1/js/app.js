// URL for earthquake data (all earthquakes in the past week)
const earthquakeUrl =
  "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson";

// Fetching data from the API
fetch(earthquakeUrl)
  .then((response) => response.json())
  .then((data) => {
    const earthquakes = processEarthquakeData(data.features);
    createMap(earthquakes);
  })
  .catch((error) => console.error("Error loading data:", error));

// Convert magnitude and depth to numbers, and filter incomplete data
function processEarthquakeData(features) {
  return features
    .map((d) => ({
      magnitude: +d.properties.mag,
      depth: +d.geometry.coordinates[2],
      location: d.properties.place,
      time: new Date(d.properties.time),
      coordinates: [d.geometry.coordinates[1], d.geometry.coordinates[0]],
    }))
    .filter((d) => !isNaN(d.magnitude) && !isNaN(d.depth)); // Filter out invalid data
}

function createMap(earthquakes) {
  // Initialize the map
  const map = L.map("map").setView([31.110094, -8.37], 6); // Centered on Morocco

  // Add a street view layer
  L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
    attribution: "&copy; OpenStreetMap contributors",
  }).addTo(map);

  // Visualize each earthquake
  earthquakes.forEach((eq) => {
    // Set circle marker properties using magnitude and depth
    const marker = L.circleMarker(eq.coordinates, {
      radius: getRadius(eq.magnitude),
      fillColor: getColor(eq.depth),
      color: "black",
      weight: 0.5,
      fillOpacity: 0.75,
    });

    // Add popup with detailed information
    marker.bindPopup(`
        <strong style="font-size: 16px";>Magnitude ${eq.magnitude} Earthquake</strong><br><br>
        <strong>Depth: ${eq.depth}</strong>
        <hr>
        <strong>${eq.location}</strong>
        <hr>
        <p>${eq.time}</p>
      `);

    // Add marker to map
    marker.addTo(map);
  });

  // Add legend
  addLegend(map);
}

// Determine circle size based on earthquake magnitude
function getRadius(magnitude) {
  return magnitude * 4; // Scale for visualization
}

// Determine circle color based on depth
function getColor(depth) {
  return depth >= 90
    ? "rgb(105,179,76)"
    : depth > 70
    ? "rgb(172,179,52)"
    : depth > 50
    ? "rgb(250,183,51)"
    : depth > 30
    ? "rgb(255,142,21)"
    : depth > 10
    ? "rgb(255,78,17)"
    : "rgb(255,13,13)";
}

// Add a legend explaining color coding based on depth
function addLegend(map) {
  const legend = L.control({ position: "bottomright" });

  legend.onAdd = function () {
    const div = L.DomUtil.create("div", "info legend");
    const depths = [-10, 10, 30, 50, 70, 90];
    const colors = [
      "rgb(255,13,13)",
      "rgb(255,78,17)",
      "rgb(255,142,21)",
      "rgb(250,183,51)",
      "rgb(172,179,52)",
      "rgb(105,179,76)",
    ];

    // Add title
    div.innerHTML +=
      '<h2 style="background:white; padding: 5px; text-align: center;">Depth</h2>';

    // Loop through depth intervals and generate a label with colored square for each
    for (let i = 0; i < depths.length; i++) {
      div.innerHTML += `<i style="background:${colors[i]}"></i> ${depths[i]}${
        depths[i + 1] ? `&ndash;${depths[i + 1]}` : "+"
      } km<br>`;
    }

    // Add white background to the legend
    div.style.background = "white";
    div.style.padding = "15px";
    div.style.borderRadius = "5px";
    div.style.opacity = "0.8";

    return div;
  };

  legend.addTo(map);
}
