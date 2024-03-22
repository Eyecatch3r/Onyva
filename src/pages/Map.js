import React, { Component } from "react";
import withAuthCheck from "../components/AuthComponent";
import { GoogleMap, LoadScript, Marker } from "@react-google-maps/api";

const containerStyle = {
  width: "100%",
  height: "80vh",
};

const options = {
  styles: [
    {
      featureType: "all",
      stylers: [{ visibility: "off" }], // turn off all features
    },
    {
      featureType: "poi.attraction",
      stylers: [{ visibility: "off" }], // turn on landmarks
    },
    {
      featureType: "poi.business",
      stylers: [{ visibility: "off" }], // turn on landmarks
    },
    {
      featureType: "administrative",
      stylers: [{ visibility: "on" }], // turn on landmarks
    },
    {
      featureType: "landscape",
      stylers: [{ visibility: "on" }], // turn on landmarks
    },
    {
      featureType: "road",
      stylers: [{ visibility: "on" }], // turn on landmarks
    },
    {
      featureType: "water",
      stylers: [{ visibility: "on" }], // turn on landmarks
    },
    { elementType: "geometry", stylers: [{ color: "#242f3e" }] },
    { elementType: "labels.text.stroke", stylers: [{ color: "#242f3e" }] },
    { elementType: "labels.text.fill", stylers: [{ color: "#746855" }] },
    {
      featureType: "administrative.locality",
      elementType: "labels.text.fill",
      stylers: [{ color: "#d59563" }],
    },
    {
      featureType: "poi",
      elementType: "labels.text.fill",
      stylers: [{ color: "#d59563" }],
    },
    {
      featureType: "poi.park",
      elementType: "geometry",
      stylers: [{ color: "#263c3f" }],
    },
    {
      featureType: "poi.park",
      elementType: "labels.text.fill",
      stylers: [{ color: "#6b9a76" }],
    },
    {
      featureType: "road",
      elementType: "geometry",
      stylers: [{ color: "#38414e" }],
    },
    {
      featureType: "road",
      elementType: "geometry.stroke",
      stylers: [{ color: "#212a37" }],
    },
    {
      featureType: "road",
      elementType: "labels.text.fill",
      stylers: [{ color: "#9ca5b3" }],
    },
    {
      featureType: "road.highway",
      elementType: "geometry",
      stylers: [{ color: "#746855" }],
    },
    {
      featureType: "road.highway",
      elementType: "geometry.stroke",
      stylers: [{ color: "#1f2835" }],
    },
    {
      featureType: "road.highway",
      elementType: "labels.text.fill",
      stylers: [{ color: "#f3d19c" }],
    },
    {
      featureType: "transit",
      elementType: "geometry",
      stylers: [{ color: "#2f3948" }],
    },
    {
      featureType: "transit.station",
      elementType: "labels.text.fill",
      stylers: [{ color: "#d59563" }],
    },
    {
      featureType: "water",
      elementType: "geometry",
      stylers: [{ color: "#17263c" }],
    },
    {
      featureType: "water",
      elementType: "labels.text.fill",
      stylers: [{ color: "#515c6d" }],
    },
    {
      featureType: "water",
      elementType: "labels.text.stroke",
      stylers: [{ color: "#17263c" }],
    },
  ],
  fullscreenControl: false,
  mapTypeControl: false,
  streetViewControl: false,
};

class CustomZoomControl extends Component {
  render() {
    return (
      <div className="custom-zoom-control">
        <button onClick={this.props.onZoomIn}>++</button>
        <button onClick={this.props.onZoomOut}>-</button>
      </div>
    );
  }
}

class MapPage extends Component {
  map = null;

  constructor(props) {
    super(props);
    this.state = {
      lat: 48.858358859763825,
      lng: 2.2940837889915406,
      markers: [],
    };
  }

  componentDidMount() {
    navigator.geolocation.getCurrentPosition(
      (position) => {
        this.setState({
          lat: position.coords.latitude,
          lng: position.coords.longitude,
        });
      },
      (error) => console.error(error),
      { enableHighAccuracy: true },
    );
  }

  fetchLandmarks = () => {
    if (!this.map || !window.google) {
      console.error("Google Maps API is not ready");
      return;
    }

    const request = {
      location: new window.google.maps.LatLng(this.state.lat, this.state.lng),
      radius: "5000",
      type: ["tourist_attraction"],
    };

    this.placesService = new window.google.maps.places.PlacesService(this.map);
    this.placesService.nearbySearch(request, (results, status) => {
      if (
        status === window.google.maps.places.PlacesServiceStatus.OK &&
        results
      ) {
        const markers = results.map((place) => ({
          position: place.geometry.location,
          title: place.name,
        }));
        this.setState({ markers });
      }
    });
  };

  handleLoad = (map) => {
    this.map = map;
    this.fetchLandmarks(); // Correctly placed inside handleLoad
  };

  renderMarkers = () => {
    return this.state.markers.map((marker, index) => (
      <Marker key={index} position={marker.position} title={marker.title} />
    ));
  };

  render() {
    return (
      <LoadScript
        googleMapsApiKey={process.env.REACT_APP_GOOGLE_MAPS_API_KEY}
        libraries={["places"]}
      >
        <GoogleMap
          onLoad={this.handleLoad}
          mapContainerStyle={containerStyle}
          center={{ lat: this.state.lat, lng: this.state.lng }}
          zoom={15}
          options={options}
        >
          {this.renderMarkers()}
          <CustomZoomControl />
        </GoogleMap>
      </LoadScript>
    );
  }
}

export default withAuthCheck(MapPage);
