import { css } from "uebersicht";
import ms from "./src/ms";
import { utcToZonedTime, format } from "./src/date-fns-tz";
import { isWithinInterval, add, sub } from "./src/date-fns";
import Color from "./src/color";
import SunCalc from "./src/suncalc";
import {
  City,
  FaceMarkersAndNumbers,
  MinutesPointer,
  HoursPointer,
  SecondsPointer,
} from "./src/appleWatchface";

const divSize = 250; // Change widget width here, everything will resize
const places = require("./places.json"); // Change the places you want to display in this file

const lightColor = "hsl(0, 0%, 100%)";
const darkColor = "hsl(0, 0%, 20%)";
const markerColor = "hsla(0, 0%, 50%, 0.5)";
const markerColorDark = "hsl(0, 0%, 33%)";
const secondsPointerColor = "hsl(8, 72%, 56%)";
const highlightColor = "hsl(212, 94%, 97.5%)";
const darkHighlightColor = "hsl(212, 94%, 20%)";
const redColor = "hsl(8, 72%, 56%)";
const metric = "px";
const clockSize = places.length === 1 ? divSize * 0.756 : divSize * 0.4;

export const refreshFrequency = ms("30m");

const timezones = require("./timezones.json");

export const command = (dispatch) => {
  const now = new Date();
  const seconds = now.getSeconds();
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
    .filter((city) => city.timezone && timezones.includes(city.timezone))
    .map((city, index) => {
      const { name, timezone, results } = city;
      const timeAt = utcToZonedTime(now, timezone);
      const minutes = timeAt.getMinutes();
      const hours = timeAt.getHours();
      const differenceAMPM = hours < 12 ? 12 : 24;
      const timeATPM = sub(add(timeAt, { hours: differenceAMPM - hours }), {
        seconds,
        minutes,
      });
      const delayUntilAMPM = ((timeAt - timeATPM) / 1000) * -1;
      const secondsPointer = (seconds * 360) / 60;
      const minutesCalc = (minutes * 360) / 60;
      const minutesPointer = minutesCalc + secondsPointer / 60;
      const hoursPointer = (hours * 360) / 12 + minutesCalc / 12;
      const sunrise = utcToZonedTime(new Date(results.sunrise), timezone);
      const sunset = utcToZonedTime(new Date(results.sunset), timezone);
      const minuteRotate = minutesPointer;
      const hourRotate = hoursPointer;
      const isDay = isWithinInterval(timeAt, {
        start: sunrise,
        end: sunset,
      });
      const clockColor = isDay ? highlightColor : darkHighlightColor;
      const textColor = isDay ? darkColor : lightColor;
      const cityName = `${timezone
        .replace(/[\W_]+/g, "")
        .toLowerCase()}${index}`;
      const dayDate = format(timeAt, "EEE", {
        timeZone: timezone,
      }).toUpperCase();
      const numberDate = format(timeAt, "dd", {
        timeZone: timezone,
      });

      const timeATNight = sub(add(timeAt, { hours: 24 - hours }), {
        seconds,
        minutes,
      });
      const delayUntilNight = ((timeAt - timeATNight) / 1000) * -1;
      const daySwitch = [
        {
          alphaDate: format(timeAt, "EEE", {
            timeZone: timezone,
          }).toUpperCase(),
          numericDate: format(timeAt, "dd", {
            timeZone: timezone,
          }),
        },
        {
          alphaDate: format(add(timeAt, { days: 1 }), "EEE", {
            timeZone: timezone,
          }).toUpperCase(),
          numericDate: format(add(timeAt, { days: 1 }), "dd", {
            timeZone: timezone,
          }),
        },
      ];
      const ampm = format(timeAt, "aa", {
        timeZone: timezone,
      }).toLowerCase();

      city.details = {
        ampm,
        cityName,
        clockColor,
        daySwitch,
        delayUntilAMPM,
        delayUntilNight,
        hourRotate,
        hoursPointer,
        isDay,
        minuteRotate,
        minutesPointer,
        numberDate,
        secondsPointer,
        textColor,
      };
      return city;
    });
  const object = { type: "DATA", data: { clocks } };
  return dispatch(object);
};

const clockContainer = css({
  position: "relative",
  width: `${clockSize * 1.25}${metric}`,
  height: `${clockSize * 1.25}${metric}`,
  zIndex: "1",
  "&:hover": {
    transform: "scale(1.05, 1.05) !important",
  },
});

const clock = css({
  position: "absolute",
  top: "10%",
  left: "10%",
  bottom: "10%",
  right: "10%",
  borderRadius: "50%",
  overflow: "visible",
});

const innerShadow = css({
  position: "absolute",
  top: "0%",
  left: "0%",
  bottom: "0%",
  right: "0%",
  borderRadius: "50%",
  overflow: "hidden",
  boxShadow: `inset 0 ${clockSize * 0.003125 * 4}${metric} ${
    clockSize * 0.003125 * 5
  }${metric} ${Color(darkColor).alpha(0.25)}`,
});

const pointerContainer = css({
  position: "absolute",
  top: "10%",
  left: "10%",
  bottom: "10%",
  right: "10%",
});

const pointersContainer = css({
  filter: `drop-shadow(0 ${clockSize * 0.003125 * 6}${metric} ${
    clockSize * 0.003125 * 5
  }${metric} ${Color(darkColor).alpha(0.5)})`,
});

const cityContainer = css({
  position: "absolute",
  top: "-2.5%",
  left: "-2.5%",
  bottom: "-2.5%",
  right: "-2.5%",
  zIndex: "-2.5%",
});

const dayStyle = css({
  position: "absolute",
  padding: `${clockSize / 75}${metric}`,
  borderRadius: `${clockSize / 75}${metric}`,
  fontWeight: 300,
  top: "50%",
  left: "72.5%",
  transform: "translate(-50%,-50%)",
  textAlign: "center",
  lineHeight: 1,
  height: "1.3em",
  width: "32.5%",
  overflow: "hidden",
  whiteSpace: "nowrap",
  boxShadow: `inset ${clockSize * 0.003125}${metric} ${
    clockSize * 0.003125 * 2
  }${metric} ${clockSize * 0.003125 * 4}${metric} ${Color(darkColor).alpha(
    0.5
  )}`,
});

const ampmStyle = css({
  position: "absolute",
  padding: `${clockSize / 75}${metric}`,
  borderRadius: `${clockSize / 75}${metric}`,
  fontWeight: 300,
  top: "21%",
  left: "50%",
  transform: "translate(-50%,-50%)",
  textAlign: "center",
  lineHeight: 1,
  height: "1.3em",
  width: "16%",
  overflow: "hidden",
  textOverflow: "ellipsis",
  whiteSpace: "nowrap",
  boxShadow: `inset ${clockSize * 0.003125}${metric} ${
    clockSize * 0.003125 * 2
  }${metric} ${clockSize * 0.003125 * 4}${metric} ${Color(darkColor).alpha(
    0.5
  )}`,
});

export const className = `

  left: 500px;
  bottom: 340px;

  @media (prefers-color-scheme: dark) {
    opacity: 0.75;
  }

  .redColor {
    color: ${redColor};
  }

  .mainContainer {
    padding: ${divSize / 20}${metric};
    background-color: ${Color(lightColor).alpha(0.5)};
    backdrop-filter: blur(2px);
    border-radius: ${divSize / 10}${metric};
    box-sizing: border-box;
    box-shadow: inset 0 2px 10px hsla(0, 0%, 0%, 0.25);
    font-size: ${clockSize / 15}${metric};

    @media (prefers-color-scheme: dark) {
      background-color: ${Color(darkColor).alpha(0.5)};
    }    
  }

  .mainContainer,
  .mainContainer * {
    box-sizing: border-box;
  }

  .worldClockContainer {
    border-radius: ${divSize / 15}${metric};
    background-color: ${lightColor};
    padding: 0;
    display: grid;
    grid-template-columns: repeat(2, 50%);
    box-shadow: 0 2px 1px hsla(0, 0%, 0%, 0.09), 
      0 4px 2px hsla(0, 0%, 0%, 0.09), 
      0 8px 4px hsla(0, 0%, 0%, 0.09), 
      0 16px 8px hsla(0, 0%, 0%, 0.09),
      0 32px 16px hsla(0, 0%, 0%, 0.09);
    font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol";
    z-index: 0;

    @media (prefers-color-scheme: dark) {
      color: ${lightColor};
      background-color: ${darkColor};
    }
  }
`;

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
  if (clocks && clocks.length > 0) {
    return (
      <div className="mainContainer">
        <div className="worldClockContainer">
          {clocks.length > 0 &&
            clocks.map((clockItem, index) => {
              const {
                name,
                extra,
                details: {
                  ampm,
                  cityName,
                  clockColor,
                  dayDate,
                  daySwitch,
                  delayUntilAMPM,
                  delayUntilNight,
                  hourRotate,
                  hoursPointer,
                  isDay,
                  minuteRotate,
                  minutesPointer,
                  numberDate,
                  secondsPointer,
                  textColor,
                },
              } = clockItem;
              const ampmSwitch = ampm === "am" ? [ampm, "pm"] : [ampm, "am"];
              return (
                <div key={`${cityName}${index}`} className={clockContainer}>
                  <style
                    dangerouslySetInnerHTML={{
                      __html: `
                        @keyframes rotatingSeconds${cityName} {
                          from {
                            transform: rotate(${secondsPointer}deg);
                          }
                          to {
                              transform: rotate(${secondsPointer + 360}deg);
                          }
                        }
                        @keyframes rotatingMinutes${cityName} {
                          from {
                            transform: rotate(${minuteRotate}deg);
                          }
                          to {
                              transform: rotate(${minuteRotate + 360}deg);
                          }
                        }
                        @keyframes rotatingHours${cityName} {
                          from {
                            transform: rotate(${hourRotate}deg);
                          }
                          to {
                              transform: rotate(${hourRotate + 360}deg);
                          }
                        }
                        @keyframes ampmSwitch${cityName} {
                          from {
                            transform: translate(0, 0);
                          }
                          to {
                            transform: translate(0, -50%);
                          }
                        }

                        .ampmSwitch${cityName} {
                          animation: ampmSwitch${cityName} 1s linear ${delayUntilAMPM}s forwards;
                        }

                        .daySwitch${cityName} {
                          animation: ampmSwitch${cityName} 1s linear ${delayUntilNight}s forwards;
                        }
                    `,
                    }}
                  />
                  <div
                    className={clock}
                    style={{
                      color: textColor,
                    }}
                  >
                    <FaceMarkersAndNumbers isDay={isDay} />
                    <div className={ampmStyle}>
                      <div className={`ampmSwitch${cityName}`}>
                        {ampmSwitch.map((a) => (
                          <div key={a}>{a.toUpperCase()}</div>
                        ))}
                      </div>
                    </div>
                    <div className={dayStyle}>
                      <div className={`daySwitch${cityName}`}>
                        {daySwitch.map(({alphaDate, numericDate}) => (
                          <div key={`${alphaDate}${numericDate}`}>
                            <span>{alphaDate}</span> <span className="redColor">{numericDate}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                    <div className={pointersContainer}>
                      <div
                        className={pointerContainer}
                        style={{
                          animation: `rotatingMinutes${cityName} 3600s linear infinite` /* 60 * 60 */,
                        }}
                      >
                        <MinutesPointer isDay={isDay} />
                      </div>
                      <div
                        className={pointerContainer}
                        style={{
                          animation: `rotatingHours${cityName} 43200s linear infinite` /* 60 * 60 * 12 */,
                        }}
                      >
                        <HoursPointer isDay={isDay} />
                      </div>
                      <div
                        className={pointerContainer}
                        style={{
                          animation: `rotatingSeconds${cityName} 60s linear infinite`,
                        }}
                      >
                        <SecondsPointer />
                      </div>
                      <div className={innerShadow} />
                    </div>
                  </div>
                  <div className={cityContainer}>
                    <City city={name} />
                  </div>
                </div>
              );
            })}
        </div>
      </div>
    );
  }

  return <div></div>;
};
