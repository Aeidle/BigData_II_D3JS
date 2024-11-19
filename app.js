// let array = ["1", "2", "3", "4", "5", "6", "7", "8", "9", "10"];

// let newArray = array.map((d) => {
//   return parseInt(d) * 2;
// });

// console.log(newArray);

const earthquakeUrl =
  "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson";

fetch(earthquakeUrl)
  .then((response) => response.json())
  .then((data) => {
    const earthquakeData = processEarthquakeData(data.features);
    console.log(earthquakeData);
  })
  .catch((error) => console.error("error happend", error));

// console.log(res);

function processEarthquakeData(data) {
  return data
    .map((d) => ({
        magnitude: Number(d.properties.mag),
        depth: Number(d.geometry.coordinates[2]),
        type: d.properties.type,
        place: d.properties.place,
        time: new Date(d.properties.time),
        coordinates: [d.geometry.coordinates[0], d.geometry.coordinates[0]]
    }));
}
