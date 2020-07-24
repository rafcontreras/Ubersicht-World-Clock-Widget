import { css } from "uebersicht";
import ms from "./src/ms";
import { utcToZonedTime } from "./src/date-fns-tz";
import { isWithinInterval } from "./src/date-fns";
import Color from "./src/color";
import SunCalc from "./src/suncalc";

const divSize = 250; // Change widget width here, everything will resize
const places = require("./places.json"); // Change the places you want to display in this file

const lightColor = "hsl(0, 0%, 100%)";
const darkColor = "hsl(0, 0%, 20%)";
const markerColor = "hsla(0, 0%, 50%, 0.5)";
const markerColorDark = "hsl(0, 0%, 33%)";
const secondsPointerColor = "hsl(8, 72%, 56%)";
const highlightColor = "hsl(212, 94%, 97.5%)";
const darkHighlightColor = "hsl(212, 94%, 20%)";
const metric = "px";
const clockSize = divSize * 0.4;

export const refreshFrequency = ms("30m");

const timezones = require("./timezones.json");

export const command = (dispatch) => {
  const clocks = places
    .map((city) => {
      const { lat, lng } = city;
      const latIsInBounds =
        lat && typeof lat === "number" && lat >= -90 && lat <= 90;
      const lonIsInBounds =
        lng && typeof lng === "number" && lng >= -180 && lng <= 180;
      const inBounds = latIsInBounds && lonIsInBounds;

      if (inBounds) {
        const now = new Date();
        city.results = SunCalc.getTimes(now, lat, lng);
        city.sunPosition = SunCalc.getPosition(now, lat, lng);
        city.moonPosition = SunCalc.getMoonPosition(now, lat, lng);
        city.moonIlumination = SunCalc.getMoonIllumination(now);
      }
      return city;
    })
    .filter((city) => city.results)
    .filter((city) => city.timezone && timezones.includes(city.timezone));
  const object = { type: "DATA", data: { clocks } };
  return dispatch(object);
};

const clock = css({
  width: `${clockSize}${metric}`,
  height: 0,
  borderRadius: "50%",
  position: "relative",
  paddingBottom: "80%",
  margin: "10%",
  overflow: "hidden",
  border: `${clockSize * 0.003125}${metric} solid ${Color(darkHighlightColor)
    .lighten(2.75)
    .alpha(0.5)}`,
  "@media (prefers-color-scheme: dark)": {
    borderColor: `${Color(lightColor).alpha(0.5)}`,
  },
  "&:hover": {
    transform: "scale(1.05, 1.05) !important",
  },
});

const markerContainer = css({
  position: "absolute",
  top: 0,
  left: "50%",
  transform: "rotate(90deg) translate(-50%, -50%)",
});

const regularMarkerStyle = css({
  position: "absolute",
  "&::after": {
    content: `""`,
    position: "absolute",
    width: `${clockSize * 0.00625}${metric}`,
    height: `${clockSize / 32}${metric}`,
    backgroundColor: `${Color(darkHighlightColor).lighten(2.75).alpha(0.5)}`,
    top: 0,
    left: `${clockSize / 20}${metric}`,
    transform: "translate(-50%, -50%) rotate(90deg)",
    borderRadius: `${clockSize * 0.0125}${metric}`,
  },
});

const markerstyle = css({
  position: "absolute",
  "&::after": {
    content: `""`,
    position: "absolute",
    width: `${clockSize * 0.0125}${metric}`,
    height: `${clockSize / 16}${metric}`,
    backgroundColor: `${Color(darkHighlightColor).lighten(2.75).alpha(0.5)}`,
    top: 0,
    left: `${clockSize / 20}${metric}`,
    transform: "translate(-50%, -50%) rotate(90deg)",
    borderRadius: `${clockSize * 0.0125}${metric}`,
  },
});

const pointerContainer = css({
  position: "absolute",
  top: 0,
  right: 0,
  bottom: 0,
  left: 0,
  widt: "100%",
  height: "100%",
});

const secondsPointerStyle = css({
  position: "absolute",
  backgroundColor: `${secondsPointerColor}`,
  width: "1%",
  height: "50%",
  top: "33%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  borderRadius: `${clockSize * 0.03125}${metric}`,
});

const minutesPointerStyle = css({
  position: "absolute",
  backgroundColor: `${darkColor}`,
  width: "3%",
  height: "35%",
  top: `65%`,
  left: "50%",
  transform: "translate(-50%, -50%)",
  border: `${clockSize * 0.0078125}${metric} solid ${lightColor}`,
  borderRadius: `${clockSize * 0.03125}${metric}`,
});

const minutesPointerStyleDark = css({
  position: "absolute",
  backgroundColor: `${lightColor}`,
  width: "3%",
  height: "35%",
  top: `65%`,
  left: "50%",
  transform: "translate(-50%, -50%)",
  border: `${clockSize * 0.0078125}${metric} solid ${darkColor}`,
  borderRadius: `${clockSize * 0.03125}${metric}`,
});

const hoursPointerStyle = css({
  position: "absolute",
  backgroundColor: `${darkColor}`,
  width: "3%",
  height: "25%",
  top: "62.5%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  border: `${clockSize * 0.0078125}${metric} solid ${lightColor}`,
  borderRadius: `${clockSize * 0.03125}${metric}`,
});

const hoursPointerStyleDark = css({
  position: "absolute",
  backgroundColor: `${lightColor}`,
  width: "3%",
  height: "25%",
  top: "62.5%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  border: `${clockSize * 0.0078125}${metric} solid ${darkColor}`,
  borderRadius: `${clockSize * 0.03125}${metric}`,
});

const circleStyle = css({
  position: "absolute",
  width: `${clockSize / 20}${metric}`,
  height: `${clockSize / 20}${metric}`,
  backgroundColor: `${secondsPointerColor}`,
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  borderRadius: "50%",
});

const cityStyle = css({
  position: "absolute",
  fontSize: `${clockSize / 13}${metric}`,
  fontWeight: 300,
  top: "65%",
  left: "50%",
  transform: "translate(-50%,-50%)",
  textAlign: "center",
  lineHeight: 1,
  width: "100%",
  maxWidth: "47.5%",
  overflow: "hidden",
  textOverflow: "ellipsis",
  display: "-webkit-box",
  WebkitLineClamp: "2",
  WebkitBoxOrient: "vertical",
});

export const className = `

  left: 20px;
  bottom: 340px;

  .mainContainer {
    z-index: 2;
    padding: ${divSize / 20}${metric};
    background-color: ${Color(lightColor).alpha(0.5)};
    backdrop-filter: blur(2px);
    border-radius: ${divSize / 10}${metric};
    box-sizing: border-box;
    box-shadow: inset 0 2px 10px hsla(0, 0%, 0%, 0.25);

    @media (prefers-color-scheme: dark) {
      background-color: ${Color(darkColor).alpha(0.5)};
    }

    * {
      box-sizing: border-box;
    }
  }

  .worldClockContainer {
    width: ${divSize}${metric};
    border-radius: ${divSize / 15}${metric};
    background-color: ${lightColor};
    display: grid;
    grid-template-columns: repeat(2, 50%);
    box-shadow: 0 2px 1px hsla(0, 0%, 0%, 0.09), 
      0 4px 2px hsla(0, 0%, 0%, 0.09), 
      0 8px 4px hsla(0, 0%, 0%, 0.09), 
      0 16px 8px hsla(0, 0%, 0%, 0.09),
      0 32px 16px hsla(0, 0%, 0%, 0.09);
    font-family: "-apple-system";

    @media (prefers-color-scheme: dark) {
      color: ${lightColor};
      background-color: ${darkColor};
    }
  }

  .number {
    position: absolute;
    font-size: ${divSize / 32}${metric};
    transform: translate(-50%, -50%);
    line-height: ${divSize / 20}${metric};
    text-align: center;
    width: ${divSize / 20}${metric};
    height: ${divSize / 20}${metric};

    &:nth-of-type(1) {
      top: 18%;
      left: 68%;
    }
    &:nth-of-type(2) {
      top: 31%;
      left: 82%;
    }
    &:nth-of-type(3) {
      top: 50%;
      left: 87%;
    }
    &:nth-of-type(4) {
      top: 69%;
      left: 82%;
    }
    &:nth-of-type(5) {
      top: 82%;
      left: 68%;
    }
    &:nth-of-type(6) {
      top: 87%;
      left: 50%;
    }
    &:nth-of-type(7) {
      top: 82%;
      left: 32%;
    }
    &:nth-of-type(8) {
      top: 69%;
      left: 18%;
    }
    &:nth-of-type(9) {
      top: 50%;
      left: 13%;
    }
    &:nth-of-type(10) {
      top: 31%;
      left: 18%;
    }
    &:nth-of-type(11) {
      top: 18%;
      left: 32%;
    }
    &:nth-of-type(12) {
      top: 13%;
      left: 50%;
    }
  }
`;

const renderMarkers = () => {
  const markers = new Array(60).fill(0);
  return (
    <div className={markerContainer}>
      {markers.map((marker, index) => {
        const hour = index + 1;
        const rotation = 6 * hour;
        const transformOrigin = `${clockSize / 2}${metric} 50%`;
        const isHour = hour % 5;
        const markerStyle = !isHour ? markerstyle : regularMarkerStyle;
        return (
          <div
            key={hour}
            className={markerStyle}
            style={{
              transform: `rotate(${rotation}deg)`,
              transformOrigin,
              backgroundColor: isHour ? "#f0f" : "#0f0",
            }}
          ></div>
        );
      })}
    </div>
  );
};

export const initialState = {
  data: places,
};

// Update state
export const updateState = (event, previousState) => {
  const { type, data } = event;
  if (type === "DATA") {
    return data;
  }

  return previousState;
};

export const render = ({ clocks }) => {
  const seconds = new Date().getSeconds();

  if (clocks && clocks.length > 0) {
    return (
      <div className="mainContainer">
        <div className="worldClockContainer">
          {clocks &&
            clocks.length > 0 &&
            clocks.map(({ name, timezone, results }, index) => {
              const timeAt = utcToZonedTime(new Date(), timezone);
              const minutes = timeAt.getMinutes();
              const hours = timeAt.getHours();
              const secondsPointer = (seconds * 360) / 60;
              const minutesPointer =
                (minutes * 360) / 60 + (seconds * 360) / 60 / 60 - 180;
              const hoursPointer =
                (hours * 360) / 12 + (minutes * 360) / 60 / 12 - 180;
              const sunrise = utcToZonedTime(
                new Date(results.sunrise),
                timezone
              );
              const sunset = utcToZonedTime(new Date(results.sunset), timezone);
              const minuteRotate = minutesPointer;
              const hourRotate = hoursPointer;
              const isDay = isWithinInterval(timeAt, {
                start: sunrise,
                end: sunset,
              });
              const clockColor = isDay ? highlightColor : darkHighlightColor;
              const textColor = isDay ? darkColor : lightColor;
              const city = name.replace(/\s/g, "").toLowerCase();
              const hourMarkers = new Array(12).fill(1);

              return (
                <div
                  key={city}
                  className={clock}
                  style={{
                    backgroundColor: clockColor,
                    color: textColor,
                  }}
                >
                  <style
                    dangerouslySetInnerHTML={{
                      __html: `
                      @keyframes rotatingSeconds${city} {
                        0% {
                          transform: rotate(${secondsPointer}deg);
                        }
                        100% {
                            transform: rotate(${secondsPointer + 360}deg);
                        }
                      }
                      @keyframes rotatingSecondsNumber${city} {
                        0% {
                          transform: rotate(-${secondsPointer}deg);
                        }
                        100% {
                            transform: rotate(-${secondsPointer + 360}deg);
                        }
                      }
                      @keyframes rotatingMinutes${city} {
                        from {
                          transform: rotate(${minuteRotate}deg);
                        }
                        to {
                            transform: rotate(${minuteRotate + 360}deg);
                        }
                      }
                      @keyframes rotatingHours${city} {
                        from {
                          transform: rotate(${hourRotate}deg);
                        }
                        to {
                            transform: rotate(${hourRotate + 360}deg);
                        }
                      }
                  `,
                    }}
                  />
                  {hourMarkers.map((marker, i) => (
                    <div key={i} className="number">
                      {i + 1}
                    </div>
                  ))}
                  {renderMarkers()}
                  <div
                    className={pointerContainer}
                    style={{
                      transform: `rotate(${minuteRotate}deg)`,
                      animation: `rotatingMinutes${city} 3600s linear infinite` /* 60 * 60 */,
                    }}
                  >
                    <div
                      className={
                        isDay ? minutesPointerStyle : minutesPointerStyleDark
                      }
                    ></div>
                  </div>
                  <div
                    className={pointerContainer}
                    style={{
                      transform: `rotate(${hourRotate}deg)`,
                      animation: `rotatingHours${city} 43200s linear infinite` /* 60 * 60 * 12 */,
                    }}
                  >
                    <div
                      className={
                        isDay ? hoursPointerStyle : hoursPointerStyleDark
                      }
                    ></div>
                  </div>
                  <div
                    className={pointerContainer}
                    style={{
                      transform: `rotate(${secondsPointer}deg)`,
                      animation: `rotatingSeconds${city} 60s linear infinite`,
                    }}
                  >
                    <div className={secondsPointerStyle}></div>
                  </div>
                  <div className={circleStyle}></div>
                  <div className={cityStyle}>{name}</div>
                </div>
              );
            })}
        </div>
      </div>
    );
  }

  return <div></div>;
};
