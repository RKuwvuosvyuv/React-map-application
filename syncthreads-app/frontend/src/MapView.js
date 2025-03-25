import React, { useState, useEffect } from "react";
import { MapContainer, TileLayer } from "react-leaflet";
import axios from "axios";

const MapView = () => {
  const [mapData, setMapData] = useState(null);

  useEffect(() => {
    axios.get("http://localhost:5000/api/map")
      .then((res) => setMapData(res.data))
      .catch((err) => console.error(err));
  }, []);

  return (
    <div>
      <h2>Map View</h2>
      {mapData && (
        <MapContainer center={mapData.center} zoom={mapData.zoom} style={{ height: "500px", width: "100%" }}>
          <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
        </MapContainer>
      )}
    </div>
  );
};

export default MapView;
