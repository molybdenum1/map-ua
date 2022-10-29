import "./App.css";
import {
  GoogleMap,
  useLoadScript,
  Marker,
  InfoWindow,
} from "@react-google-maps/api";
import mapStyles from "./mapStyles";
import { formatRelative } from 'date-fns'
import { useCallback, useRef, useState } from "react";

const libraries = ["places"];
const mapContainerStyle = {
  width: "100vw",
  height: "100vh",
};
const center = {
  lat: 50.0,
  lng: 36.2292,
};
const options = {
  styles: mapStyles,
  disableDefaultUI: true,
  zoomControl: false,
};

const Map = () => {
  const { isLoaded, loadError } = useLoadScript({
    googleMapsApiKey: "AIzaSyBxRR3rQqu54g5Qygzqx0BlRFCWCFuYqls", //env??
    libraries: libraries,
  });
  const onMapClick = useCallback((e) => {
    setMarkers((current) => [
      ...current,
      {
        lat: e.latLng.lat(),
        lng: e.latLng.lng(),
        time: new Date(),
      },
    ]);
  }, []);
  const [markers, setMarkers] = useState([]);
  const [selected, setSelected] = useState(null)

  if (loadError) return "Error loading maps";
  if (!isLoaded) return "loading Maps";

  // const mapRef = useRef();
  // const onMapLoad = useCallback((map) => {
  //   mapRef.current = map;
  // }, [])

  return (
    <div id="map">
      <h1>
        Car accidents{" "}
        <span role="img" arial-label="tent">
          🚗
        </span>
      </h1>
      <GoogleMap
        mapContainerStyle={mapContainerStyle}
        zoom={12}
        center={center}
        options={options}
        onClick={onMapClick}
      >
        {markers.map((marker) => (
          <Marker
            key={marker.time.toISOString()}
            position={{ lat: marker.lat, lng: marker.lng }}
            icon={{
              url: "./car-crash-svgrepo-com.svg",
              scaledSize: new window.google.maps.Size(50, 50),
              origin: new window.google.maps.Point(0, 0),
              anchor: new window.google.maps.Point(25, 25),
            }}
            onClick={() => {
              setSelected(marker)
            }}
          />
        ))}

        { selected ? (
        <InfoWindow 
          position={{ lat: selected.lat, lng: selected.lng}}
          onCloseClick={() => {setSelected(null)}}
          >
          <div>
            <h2>Accident happend</h2>
            <p>at {formatRelative(selected.time, new Date())}</p>
          </div>
        </InfoWindow>) : null}
      </GoogleMap>
    </div>
  );
};

function App() {
  return (
    <div className="App">
      <Map />
    </div>
  );
}

export default App;
