import { useMemo, useState, useCallback, useRef, useEffect } from "react";
import { useSelector } from "react-redux";
import { useDispatch } from "react-redux";
import { setTripId, setWaypoints } from "../../Features/tripSlice";
import { useParams } from 'react-router-dom';
import { GoogleMap, useLoadScript, Marker, Circle, DirectionsRenderer } from "@react-google-maps/api";
import { useTrip } from './useTrip'

import { TripContainer } from "./TripContainer/TripContainer"
import { InfoModal } from "./InfoModal/InfoModal"
import { EditOriginDestination } from "./TripContainer/FormView";
import { Navbar } from "../Navbar";
//styles.css required for google map rendering. 
import "../../styles/styles.css"
/*global google*/
import { Box } from "@mui/material";

const libraries = ["places"];

export const MapComponent = () => {
  const dispatch = useDispatch()

  //tripId should always be defined
  let { tripId } = useParams();
  useEffect(() => {
    dispatch(setTripId(tripId))
  }, [])

  const { getMidpoints, addToTrip, getNearbyBusinesses, businesses, yelpSearchPoints } = useTrip();

  const { isLoaded } = useLoadScript({
    googleMapsApiKey: process.env.REACT_APP_GOOGLE_MAPS_API_KEY,
    libraries
  })
  const center = useMemo(() => ({ lat: 44, lng: -80 }), []);
  const mapRef = useRef();
  // const controller = useRef()
  const waypoint_order = useRef();
  const options = useMemo(() => ({
    mapId: 'e9159de94dc8cc93',
    disableDefaultUI: true,
    clickableIcons: false,
    minZoom: 3.5
  }), [])
  const onMapLoad = useCallback((map) => {
    mapRef.current = map;
  }, [])

  const start = useSelector((store) =>
    store.trip.origin
  )
  const end = useSelector((store) =>
    store.trip.destination
  )
  const businessesSelected = useSelector((store) =>
    store.trip.businessesSelected
  )
  const yelpCategory = useSelector((store) =>
    store.tripContainer.yelpCategory
  )
  // const [showEditTripModal, setShowEditTripModal] = useState(false)
  const [directions, setDirections] = useState(null)
  // const [yelpSearchPoints, setYelpSearchPoints] = useState([])

  //businessesSelected are selected POIs that users want to add to their trip.
  // const [businessesSelected, setBusinessesSelected] = useState([])
  //googlewaypoint are waypoints/locations that i pass into Directions API.
  const [googleWaypoints, setGoogleWaypoints] = useState([])

  const [activeMarker, setActiveMarker] = useState({ id: 'none' })
  const [selectedMarker, setSelectedMarker] = useState(false)
  const isMounted = useRef(false)

  useEffect(() => {
    getNearbyBusinesses(yelpSearchPoints, yelpCategory)
  }, [yelpSearchPoints])


  useEffect(() => {
    getMidpoints(directions)
  }, [directions])


  useEffect(() => {
    if (businessesSelected.length > 0) {
      const temp = []
      businessesSelected.map((business) => {
        temp.push({ location: { lat: business.coordinates.latitude, lng: business.coordinates.longitude } })
      })
      setGoogleWaypoints(temp)
    } else {
      setGoogleWaypoints([])
    }

  }, [businessesSelected])

  useEffect(() => {
    fetchDirections();
  }, [start, end, googleWaypoints])
  
  useEffect(() => {
    isMounted.current = true;
  }, [])

  const panTo = (position) => {
    mapRef.current.panTo(position)
    mapRef.current.setZoom(15)
  }

  const fetchDirections = () => {
    if (!start || !end) return
    const service = new google.maps.DirectionsService();
    service.route(
      {
        origin: start.coordinates,
        destination: end.coordinates,
        travelMode: google.maps.TravelMode.DRIVING,
        waypoints: googleWaypoints,
        optimizeWaypoints: true
      },
      (result, status) => {
        if (status === "OK" && result) {
          setDirections(result);
          waypoint_order.current = result.routes[0].waypoint_order;
          sortWaypoints();
        }
      }
    );
  }

  const sortWaypoints = () => {
    console.log('twice')
    const optimizedRoute = waypoint_order.current.map(index => businessesSelected[index])
    dispatch(setWaypoints(optimizedRoute))
  }




  if (!isLoaded) return <div>Loading...</div>

  return <>
    {selectedMarker && (
      <InfoModal
        selectedBusiness={selectedMarker}
        setSelectedMarker={setSelectedMarker}
        addToTrip={addToTrip}
      />
    )}


    <Box sx={{ height: '100vh', display: 'flex', flexDirection: 'column' }}>
      <Box>
        <Navbar />
      </Box>
      <Box sx={{ width: '100%', height: '100%', postiion: 'relative' }}>

        <GoogleMap
          zoom={10}
          center={center}
          mapContainerClassName="map-container"
          options={options}
          // onClick={onMapClick}
          onLoad={onMapLoad}
        >
          <Box sx={{
            position: 'absolute', height: '100%', margin: '15px', borderRadius: '25px',
            ['@media screen and (max-width: 767.9)']: { // eslint-disable-line no-useless-computed-key
              position: 'relative'
            }
          }}>
            {/* TODO:  */}
            {(directions &&
              <>
                <TripContainer
                  start={start}
                  end={end}
                  businesses={businesses}
                  directions={directions}
                  setActiveMarker={setActiveMarker}
                  panTo={panTo}
                />
              </>)}
          </Box>
          {directions && (
            <>
              <DirectionsRenderer
                directions={directions}
                options={
                  {
                    polylineOptions: {
                      zIndex: 50
                    }
                  }
                }
              />
            </>
          )}

          {businesses && (
            businesses.map((hike, index) =>
              <Marker

                position={{ lat: hike.coordinates.latitude, lng: hike.coordinates.longitude }}
                // icon={
                //   {
                //     url: "https://static.thenounproject.com/png/29961-200.png",
                //     scaledSize: new google.maps.Size(50, 50)
                //   }
                // }
                label={(index + 1).toString()}
                animation={
                  (activeMarker.id === hike.id
                    ? 1 : undefined)
                }
                onClick={() => { setSelectedMarker(hike) }}
              // onClick={()=>{console.log(hike)}}

              />
            )
          )}
        </GoogleMap>
      </Box>
    </Box>
  </>
}
