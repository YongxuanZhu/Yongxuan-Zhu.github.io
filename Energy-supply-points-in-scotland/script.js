// The value for 'accessToken' begins with 'pk...'
    mapboxgl.accessToken = 'pk.eyJ1Ijoiemh1eXgiLCJhIjoiY2wwd3ZkenNnMWU5djNjbm04bWNscGlraiJ9.tGaRNt08LR2fwUWeYTNUIQ'; 
    const map = new mapboxgl.Map({
      container: 'map',
      // Replace YOUR_STYLE_URL with your style URL.
      style: 'mapbox://styles/zhuyx/cl0xytziv003814pggpbhb7wn', 
      center: [-4.2026, 57.4907],
      zoom: 5      
    });
const geocoder = new MapboxGeocoder({
  // Initialize the geocoder
  accessToken: mapboxgl.accessToken, // Set the access token
  mapboxgl: mapboxgl, // Set the mapbox-gl instance
  marker: false, // Do not use the default marker style
  placeholder: "Enter an address or place name", // Placeholder text for the search bar
  proximity: {
    longitude: 55.8642,
    latitude: 4.2518
  } 
});

map.addControl(geocoder, "top-left");

//Add the my location control
map.addControl(new mapboxgl.GeolocateControl());

//To add the naigation control to the map to the top-right corner.
map.addControl(new mapboxgl.NavigationControl());

//To add a scale.
const scale = new mapboxgl.ScaleControl({
  maxWidth: 100, //size of the scale bar
  unit: "metric"
});
map.addControl(scale);




    map.on('click', (event) => {
const features = map.queryRenderedFeatures(event.point, {
layers: ['energysupplypoints']
});
if (!features.length) {
return;
}
const feature = features[0];
      //Fly to the point when click.
  map.flyTo({
    center: feature.geometry.coordinates, //keep this
    zoom: 13 //change fly to zoom level
  });
 
const popup = new mapboxgl.Popup({ offset: [0, 0], className: "my-popup" })
.setLngLat(feature.geometry.coordinates)
.setHTML(
`<h3>Place Name :${feature.properties.name}</h3>
<p>Energy Type :${feature.properties.primarytechnology}</p>
<p>Energy Value :${feature.properties.sizecategory}</p>
<p>Status :${feature.properties.statusdetail}</p>`
)
.addTo(map);
});

map.on("load", () => {
  // Add a new source from our GeoJSON data and
  // set the 'cluster' option to true. GL-JS will
  // add the point_count property to your source data.
  map.addSource("energysupplypoints", {
    type: "geojson", //keep this
    // Point to GeoJSON data. You can get an URL of your data uploaded to Mapbox
    // by replacing the access_token and the user name and the dataset id
    // https://api.mapbox.com/datasets/v1/<username>/<datasetid>/features/?access_token=<accesstoken>
    data:
      "https://api.mapbox.com/datasets/v1/zhuyx/cl0zkxvvf0nek29pc32fek0qi/features/?access_token=pk.eyJ1Ijoiemh1eXgiLCJhIjoiY2wweDE0cWppMDFibjNlbW9idWIwMHM3YyJ9.cIUsnrrbqdrv5151ruaZlA",

    cluster: true, //keep this
    clusterMaxZoom: 9, // Max zoom to cluster points on, no cluster beyond this zoom level
    generateId: true, //keep this
    clusterRadius: 40
    // Radius of each cluster when clustering points (defaults to 50)    
  });
  
 map.addLayer({
    id: "clusters", //keep this
    type: "circle", //keep this
    source: "energysupplypoints", //match the source name to the data source you added above
    filter: ["has", "point_count"], //keep this
    paint: {
      // Use step expressions (https://docs.mapbox.com/mapbox-gl-js/style-spec/#expressions-step)
      // with three steps to implement three types of circles:
      //   * Blue, 20px circles when point count is less than 10
      //   * Yellow, 25px circles when point count is between 10 and 20
      //   * Pink, 30px circles when point count is greater than or equal to 20
      "circle-color": [
        "step",
        ["get", "point_count"],
        "lightblue",
        10,
        "lightyellow",
        30,
        "pink"
      ],
      "circle-radius": ["step", ["get", "point_count"], 20, 10, 25, 20, 30]
    }
  });

  map.addLayer({
    id: "cluster-count", //keep this
    type: "symbol", //keep this
    source: "energysupplypoints", //match the source name to the data source you added above
    filter: ["has", "point_count"], //keep this
    layout: {
      "text-field": "{point_count_abbreviated}", //keep this
      //you can change the font and size
      "text-font": ["DIN Offc Pro Medium", "Arial Unicode MS Bold"],
      "text-size": 15
    }
    
  });
});

map.addLayer({
id: 'unclustered-point',
type: 'circle',
source: 'energysupplypoints',
filter: ['!', ['has', 'point_count']],
paint: {
'circle-color': '#11b4da',
'circle-radius': 4,
'circle-stroke-width': 1,
'circle-stroke-color': '#fff'
}
});