import React, { Component } from "react";
import withAuthCheck from "../components/AuthComponent";
import { GoogleMap, LoadScript, Marker } from "@react-google-maps/api";
import Popup from "../components/Popup";
import _ from "lodash";
import { Capacitor } from "@capacitor/core";
import { Geolocation } from "@capacitor/geolocation";

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
  zoomControl: false,
};

const optionsLightMode = {
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
    {
      featureType: "administrative",
      elementType: "geometry",
      stylers: [{ visibility: "on" }, { lightness: 30 }], // Slightly lighten administrative areas
    },
    {
      featureType: "landscape",
      elementType: "geometry",
      stylers: [{ color: "#e3e3e3" }], // Light background for landscape features
    },
    {
      featureType: "road",
      elementType: "geometry",
      stylers: [{ color: "#f5f5f5" }], // Roads with a very light color
    },
    {
      featureType: "road",
      elementType: "geometry.stroke",
      stylers: [{ visibility: "off" }], // No strokes for roads to keep it cleaner
    },
    {
      featureType: "water",
      elementType: "geometry",
      stylers: [{ color: "#aadaff" }], // Light blue water
    },
    {
      featureType: "transit.line",
      elementType: "geometry",
      stylers: [{ visibility: "on" }, { lightness: 70 }], // Make transit lines more visible and lighter
    },
    {
      elementType: "labels.text.stroke",
      stylers: [{ visibility: "off" }], // Remove text strokes for clarity
    },
    {
      elementType: "labels.text.fill",
      stylers: [{ color: "#616161" }], // Dark grey text for better readability
    },
    {
      featureType: "administrative.locality",
      elementType: "labels.text.fill",
      stylers: [{ color: "#424242" }], // Darker text for locality labels for emphasis
    },
    {
      featureType: "poi.park",
      elementType: "geometry",
      stylers: [{ color: "#c5e1a5" }], // Light green parks
    },
    {
      featureType: "poi.park",
      elementType: "labels.text.fill",
      stylers: [{ color: "#616161" }], // Grey text for park labels
    },
    {
      featureType: "road.highway",
      elementType: "geometry.fill",
      stylers: [{ color: "#ffffff" }], // White highways
    },
    {
      featureType: "road.highway",
      elementType: "labels.text.fill",
      stylers: [{ color: "#757575" }], // Grey text for highway labels
    },
  ],
  fullscreenControl: false,
  mapTypeControl: false,
  streetViewControl: false,
  zoomControl: false,
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

const libraries = ["places"];

class MapPage extends Component {
  map = null;
  popup = null;

  constructor(props) {
    super(props);
    this.state = {
      lat: 48.858358859763825,
      lng: 2.2940837889915406,
      markers: [],
      activeMarker: null,
      currentLocation: null,
      prefersLightMode: window.matchMedia("(prefers-color-scheme: light)")
        .matches,
      isApiLoaded: false,
    };
  }

  componentDidMount() {}

  setCurrentLocation = async () => {
    if (Capacitor.isPluginAvailable("Geolocation")) {
      // Check location permissions
      const permissions = await Geolocation.checkPermissions();
      if (permissions.location === "granted") {
        // Permissions are granted, proceed to get the current position
        const options = {
          enableHighAccuracy: true, // Request high accuracy location data
          maximumAge: 0, // Accept only the freshest location data
          timeout: 10000, // Maximum time to wait for a location (in milliseconds)
        };

        try {
          const position = await Geolocation.getCurrentPosition(options);
          this.setState(
            {
              currentLocation: {
                lat: position.coords.latitude,
                lng: position.coords.longitude,
              },
              lat: position.coords.latitude,
              lng: position.coords.longitude,
            },
            this.fetchLandmarks,
          );
          console.log("Geolocation success:", position.coords);
        } catch (error) {
          console.error("Geolocation error:", error);
        }
      } else {
        console.log("Geolocation permissions not granted.");
        Geolocation.requestPermissions().then(async (result) => {
          if (result.location === "granted") {
            window.location.reload();
          }
        });
      }
    } else {
      console.log("Geolocation is not supported by this browser.");
      // Since geolocation is not supported, directly call fetchLandmarks to use the default location
      this.fetchLandmarks();
    }
  };

  fetchLandmarks = _.debounce(() => {
    if (!this.map || !window.google) {
      console.error("Google Maps API is not ready");
      return;
    }

    const request = {
      location: new window.google.maps.LatLng(this.state.lat, this.state.lng),
      radius: "10000",
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
  }, 1000);

  handleApiLoaded = () => {
    this.setState({ isApiLoaded: true });
    console.log("API loaded");
    this.setCurrentLocation();
  };

  onMarkerClick = (marker) => {
    this.setState({ activeMarker: marker });
  };

  onCloseClick = () => {
    this.setState({ activeMarker: null });
  };

  handleLoad = (map) => {
    this.map = map;
  };

  renderMarkers = () => {
    return this.state.markers.map((marker) => (
      <Marker
        key={marker.id}
        position={marker.position}
        onClick={() => this.onMarkerClick(marker)}
        icon={{
          // Specify your custom icon URL
          url: `${process.env.PUBLIC_URL}/marker.png`,
          scaledSize: new window.google.maps.Size(30, 30), // Scale your icon
        }}
      >
        {this.state.activeMarker === marker && (
          <Popup
            map={this.map}
            maps={window.google.maps}
            position={marker.position}
          >
            <div
              className={
                "animate-fade-right animate-once animate-ease-out bg-base-300 p-6 rounded"
              }
            >
              <div className="card-actions justify-end">
                <h2 className={"font-bold text-xl mb-4"}>{marker.title}</h2>
                <button
                  onClick={() => this.onCloseClick()}
                  className="btn btn-square btn-sm"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-6 w-6"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                </button>
              </div>

              <div className={"flex items-center justify-center"}>
                <div className="stats shadow">
                  <div className="stat flex-wrap">
                    <div className="stat-title">Score</div>
                    <div className="stat-value text-center">
                      {Math.floor(Math.random() * 100)}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </Popup>
        )}
      </Marker>
    ));
  };

  render() {
    const { currentLocation, prefersLightMode } = this.state;
    return (
      <LoadScript
        googleMapsApiKey={process.env.REACT_APP_GOOGLE_MAPS_API_KEY}
        libraries={libraries}
        onLoad={this.handleApiLoaded}
      >
        <GoogleMap
          onLoad={this.handleLoad}
          mapContainerStyle={containerStyle}
          center={
            currentLocation || { lat: this.state.lat, lng: this.state.lng }
          }
          zoom={15}
          options={prefersLightMode ? optionsLightMode : options}
        >
          {this.state.isApiLoaded && currentLocation && (
            <Marker
              position={currentLocation}
              icon={{
                url: `${process.env.PUBLIC_URL}/currentLocation.png`, // Optional: Use a custom icon for the current location marker
                scaledSize: new window.google.maps.Size(15, 15),
              }}
              title="Your Current Location"
            />
          )}
          {this.renderMarkers()}
          <CustomZoomControl />
        </GoogleMap>
      </LoadScript>
    );
  }
}

export default withAuthCheck(MapPage);
