import { useContext, useState } from "react";
import styles from "./Video.module.css";
import video from "../img/video.MP4";
import kathy from "../img/kathy.jpg";
import InfoContext from "../store/info-context";

import PlacesAutocomplete, {
  geocodeByAddress,
  geocodeByPlaceId,
  getLatLng,
} from "react-places-autocomplete";

const Video = () => {
  const { title, setSubmitForm, icon } = useContext(InfoContext);
  const [enteredName, setEnteredName] = useState("");
  const [address, setAddress] = useState("");
  const [latitude, setLatitude] = useState();
  const [longitude, setLongitude] = useState();
  const [submitMessage, setSubmitMessage] = useState("");

  const handleSelect = async (value) => {
    const results = await geocodeByAddress(value);
    const coords = await getLatLng(results[0]);
    console.log(coords);
    setAddress(value);
    setLatitude(coords.lat);
    setLongitude(coords.lng);
  };

  const nameChangeHandler = (e) => {
    setEnteredName(e.target.value);
    console.log(enteredName);
  };

  const submitHandler = (e) => {
    e.preventDefault();
    setAddress("");
    setEnteredName("");
    setSubmitMessage(true);
    fetch(
      "https://climate-death-wheel-default-rtdb.firebaseio.com/deaths.json",
      {
        method: "POST",
        body: JSON.stringify({
          name: enteredName,
          lat: latitude,
          long: longitude,
          cause: title,
          icon: icon,
        }),
      }
    );
    setSubmitForm(true);
  };

  return (
    <div className={styles.container}>
      <div className={styles["left-container"]}>
        <p className={styles.text}>See the sign in action!</p>
        <img className={styles.img} src={kathy} />
        <video
          className={styles.video}
          src={video}
          width="300"
          height="540"
          controls="controls"
          autoPlay={false}
        />
      </div>
      <div className={styles["right-container"]}>
        <p className={styles.heading}>And add your result to the map below!</p>
        <form className={styles["form-container"]} onSubmit={submitHandler}>
          <div className={styles["label-container"]}>
            <label className={styles.label} htmlFor="name">
              Name:
            </label>
            <input
              type="text"
              id="name"
              placeholder="Kathy"
              value={enteredName}
              onChange={nameChangeHandler}
              className={styles.input}
            />
          </div>
          <div className={styles["label-container"]}>
            <label className={styles.label} htmlFor="location">
              Location:
            </label>
            <PlacesAutocomplete
              value={address}
              onChange={setAddress}
              onSelect={handleSelect}
            >
              {({
                getInputProps,
                suggestions,
                getSuggestionItemProps,
                loading,
              }) => (
                <div key={suggestions.description}>
                  <input
                    className={styles.input}
                    id="location"
                    value={address}
                    {...getInputProps({
                      placeholder: "Search Places ...",
                    })}
                  />
                  <div className="autocomplete-dropdown-container">
                    {loading && <div>Loading...</div>}
                    {suggestions.map((suggestion) => {
                      const className = suggestion.active
                        ? "suggestion-item--active"
                        : "suggestion-item";
                      // inline style for demonstration purpose
                      const style = suggestion.active
                        ? { backgroundColor: "#fafafa", cursor: "pointer" }
                        : { backgroundColor: "#ffffff", cursor: "pointer" };
                      return (
                        <div
                          {...getSuggestionItemProps(suggestion, {
                            className,
                            style,
                          })}
                        >
                          <span>{suggestion.description}</span>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}
            </PlacesAutocomplete>
          </div>
          <div className={styles["label-container"]}>
            <label className={styles.label} htmlFor="death">
              Cause of death:
            </label>
            <input
              type="text"
              id="death"
              value={title}
              className={styles.input}
              readOnly={true}
            />
          </div>
          <button className={styles.button}>Submit</button>
          {submitMessage && (
            <p className={styles.message}>Thanks for adding to the map!</p>
          )}
        </form>
      </div>
    </div>
  );
};

export default Video;
