import React from "react";
import { APIProvider } from "@vis.gl/react-google-maps";
import MapComponent from "../components/MapComponent";
import withAuthCheck from "../components/AuthComponent";

const MapPage = () => {
  return (
    <APIProvider apiKey={process.env.REACT_APP_GOOGLE_MAPS_API_KEY}>
      <MapComponent />
    </APIProvider>
  );
};

export default withAuthCheck(MapPage);
