import { useState, useEffect, useContext } from "react";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";

import InfoContext from "../store/info-context";

const MapView = () => {
  const [deaths, setDeaths] = useState([]);

  const { title, icon } = useContext(InfoContext);

  useEffect(() => {
    const fetchDeaths = async () => {
      const response = await fetch(
        "https://climate-death-wheel-default-rtdb.firebaseio.com/deaths.json"
      );
      const responseData = await response.json();

      const loadedDeaths = [];

      for (const key in responseData) {
        loadedDeaths.push({
          id: key,
          name: responseData[key].name,
          lat: responseData[key].lat,
          long: responseData[key].long,
          cause: responseData[key].cause,
        });
      }
      setDeaths(loadedDeaths);
    };

    fetchDeaths();
  }, []);
  console.log(deaths);

  const submitHandler = (event) => {
    event.preventdefault();
  };

  return (
    <div>
      <form onSubmit={submitHandler}>
        <label>
          Name:
          <input type="text" name="name" placeholder="Kathy" />
        </label>
        <label>
          Location:
          <input type="text" name="location" placeholder="Los Angeles" />
        </label>
        <label>
          Cause of death:
          <input type="text" name="death" value={title} readOnly={true} />
        </label>
        <button>Submit</button>
      </form>
      <MapContainer center={[0, 0]} zoom={2} scrollWheelZoom={true}>
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
        />

        {deaths.map((person) => {
          return (
            <Marker position={[person.lat, person.long]}>
              <Popup>
                <p>Name: {person.name}</p>
              </Popup>
            </Marker>
          );
        })}
      </MapContainer>
    </div>
  );
};

export default MapView;
