import React, { useEffect, useState } from "react";
import { Capacitor } from "@capacitor/core";
import { Geolocation } from "@capacitor/geolocation";
import { fetchScore } from "../services/firebase";
import {
  AdvancedMarker,
  Map,
  useMap,
  useMapsLibrary,
} from "@vis.gl/react-google-maps";
import { useUser } from "../contexts/UserContext";
import Popup from "./Popup";

const options = {
  fullscreenControl: true,
  mapTypeControl: false,
  streetViewControl: false,
  zoomControl: false,
  mapId: "35c1ea0760ea0775",
};
const optionsLightMode = {
  fullscreenControl: false,
  mapTypeControl: false,
  streetViewControl: false,
  zoomControl: false,
  mapId: "697fca8f7cf29b34",
};

function MapLibraryComponent({ currentLocation }) {
  const { userDetails } = useUser();
  const [markers, setMarkers] = useState([]);
  const [activeMarker, setActiveMarker] = useState(null);
  const [selectedMarkerScore, setSelectedMarkerScore] = useState(0);
  const [isLoadingScore, setIsLoadingScore] = useState(false);
  const [placesService, setPlacesService] = useState(null);
  const [geocoder, setGeocoder] = useState(null);
  const [geometryLib, setGeometryLib] = useState(null);
  const [projection, setProjection] = useState(null);

  const map = useMap();
  const pl = useMapsLibrary("places");
  const gc = useMapsLibrary("geocoding");
  const geo = useMapsLibrary("geometry");

  useEffect(() => {
    if (map) {
      setProjection(map.getProjection());
    }
  }, [map]);

  useEffect(() => {
    if (pl && map && !placesService && !geocoder && !geometryLib) {
      setPlacesService(new pl.PlacesService(map));
      setGeocoder(new gc.Geocoder());
      setGeometryLib(geo);
    }
    if (placesService && map) {
      console.log(map);
      fetchLandmarks(currentLocation);
    }
  }, [pl, gc, geo, map, placesService, geocoder, geometryLib]);

  const fetchLandmarks = (location) => {
    if (!placesService || !map || !Object.hasOwn(window, "google")) {
      console.error("Google Maps API is not ready");
      return;
    }
    const request = {
      location: new window.google.maps.LatLng(location.lat, location.lng),
      radius: 10000,
      type: "tourist_attraction",
    };
    placesService.nearbySearch(request, (results, status) => {
      if (status === pl.PlacesServiceStatus.OK && results) {
        const filteredResults = results.filter(
          (result) => result.user_ratings_total >= 5,
        );
        const newMarkers = filteredResults.map((place) => ({
          position: place.geometry.location,
          title: place.name,
          rating: place.rating,
          reviewCount: place.user_ratings_total,
        }));
        setMarkers(newMarkers);
      }
    });
  };

  const onMarkerClick = async (marker) => {
    setIsLoadingScore(true);
    setSelectedMarkerScore(0);
    setActiveMarker(marker);

    try {
      let addressGeocode = await geocodeAddress(userDetails.address);
      const distance = geometryLib.spherical.computeDistanceBetween(
        addressGeocode || currentLocation,
        marker.position,
      );
      const score = await fetchScorePromise(
        marker.rating,
        marker.reviewCount,
        distance,
      );
      setSelectedMarkerScore(score);
    } catch (error) {
      console.error("Error calculating distance", error);
    } finally {
      setIsLoadingScore(false);
    }
  };

  const onCloseClick = () => {
    setActiveMarker(null);
  };

  const renderMarkers = () => {
    return markers.map((marker, index) => {
      return (
        <React.Fragment key={index}>
          <AdvancedMarker
            position={{
              lat: marker.position.lat(),
              lng: marker.position.lng(),
            }}
            onClick={() => onMarkerClick(marker)}
          >
            <svg
              className="animate-drop-shadow-pulse text-base-200"
              width="30"
              height="30"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                fillRule="evenodd"
                clipRule="evenodd"
                d="M5 9.5C5 6.094 8.01 3 12 3s7 3.094 7 6.5c0 2.145-1.312 4.54-3.04 6.761-1.364 1.755-2.883 3.272-3.96 4.333-1.077-1.061-2.596-2.578-3.96-4.333C6.311 14.041 5 11.645 5 9.5ZM12 1C6.99 1 3 4.906 3 9.5c0 2.855 1.688 5.71 3.46 7.989 1.535 1.973 3.26 3.668 4.337 4.728.186.183.353.347.496.49a1 1 0 0 0 1.414 0c.143-.143.31-.307.496-.49 1.078-1.06 2.802-2.755 4.336-4.728C19.312 15.209 21 12.355 21 9.5 21 4.906 17.01 1 12 1Zm0 11.5a2.5 2.5 0 1 0 0-5 2.5 2.5 0 0 0 0 5Z"
                fill="currentColor"
              />
            </svg>
          </AdvancedMarker>
          {marker === activeMarker && (
            <Popup
              maps={window.google.maps}
              map={map}
              position={marker.position}
            >
              <div
                className={
                  "animate-fade-right animate-once animate-ease-out bg-base-300 p-6 rounded"
                }
              >
                <div className="card-actions justify-end">
                  <h2 className="font-bold text-xl mb-4">{marker.title}</h2>
                  <button
                    className="btn btn-square btn-sm"
                    onClick={onCloseClick}
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
                <div className="flex items-center justify-center">
                  <div className="stats shadow">
                    <div className="stat flex-wrap">
                      <div className="stat-title">Score</div>
                      <div className="stat-value text-center">
                        {isLoadingScore ? (
                          <span className="loading loading-ring loading-sm"></span>
                        ) : (
                          selectedMarkerScore
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </Popup>
          )}
        </React.Fragment>
      );
    });
  };

  const fetchScorePromise = async (rating, reviewCount, distance) => {
    try {
      return await fetchScore(rating, reviewCount, distance);
    } catch (error) {
      console.error("Error fetching score", error);
      return 0;
    }
  };

  const geocodeAddress = (address) => {
    if (address) {
      return new Promise((resolve, reject) => {
        geocoder.geocode({ address }, (results, status) => {
          if (status === window.google.maps.GeocoderStatus.OK && results[0]) {
            resolve(results[0].geometry.location);
          } else {
            reject(new Error("Failed to geocode address"));
          }
        });
      });
    }
  };

  return renderMarkers();
}

const MapComponent = () => {
  const [lat, setLat] = useState(48.858358859763825);
  const [lng, setLng] = useState(2.2940837889915406);
  const [currentLocation, setCurrentLocation] = useState(null);
  const [prefersLightMode] = useState(
    window.matchMedia("(prefers-color-scheme: light)").matches,
  );

  useEffect(() => {
    const fetchLocation = async () => {
      if (
        Capacitor.isPluginAvailable("Geolocation") &&
        Capacitor.isNativePlatform()
      ) {
        const permissions = await Geolocation.checkPermissions();
        if (permissions.location === "granted") {
          const options = {
            enableHighAccuracy: true,
            maximumAge: 0,
            timeout: 10000,
          };

          try {
            const position = await Geolocation.getCurrentPosition(options);
            const newLocation = {
              lat: position.coords.latitude,
              lng: position.coords.longitude,
            };
            setCurrentLocation(newLocation);
            setLat(newLocation.lat);
            setLng(newLocation.lng);
          } catch (error) {
            console.error("Geolocation error:", error);
          }
        } else {
          Geolocation.requestPermissions().then(async (result) => {
            if (result.location === "granted") {
              window.location.reload();
            }
          });
        }
      } else {
        const successCallback = async (position) => {
          const newLocation = {
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          };
          console.log("Geolocation success:", newLocation);
          setCurrentLocation(newLocation);
          setLat(newLocation.lat);
          setLng(newLocation.lng);
        };

        const errorCallback = (error) => {
          console.error("Geolocation error:", error);
        };

        navigator.geolocation.getCurrentPosition(
          successCallback,
          errorCallback,
          {
            enableHighAccuracy: true,
            maximumAge: 0,
            timeout: 10000,
          },
        );
      }
    };

    fetchLocation();
  }, []);

  return (
    <div className={"h-[calc(100%-83px)] w-full"}>
      <Map
        id="map"
        style={{ height: "100%", width: "100%" }}
        defaultCenter={{ lat: lat, lng: lng }}
        defaultZoom={15}
        mapId={prefersLightMode ? optionsLightMode.mapId : options.mapId}
        fullscreenControlOptions={options.fullscreenControl}
        mapTypeControlOptions={options.mapTypeControl}
        streetViewControlOptions={options.streetViewControl}
        zoomControlOptions={options.zoomControl}
        gestureHandling={"auto"}
        disableDefaultUI={true}
      >
        <AdvancedMarker position={{ lat: lat, lng: lng }}>
          <div className="px-3 py-3 animate-box-shadow-pulse rounded-full bg-base-300 text-lg text-white"></div>
        </AdvancedMarker>
        <MapLibraryComponent currentLocation={currentLocation} />
      </Map>
    </div>
  );
};

export default MapComponent;
