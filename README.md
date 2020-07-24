# World Clock Widget

A Übersicht widget to display the time at different time zones. Can show multiple time zones from 1 to infinite (might not fit in your display). Dark mode support, sunrise/sunset aware.

## Performance

The seconds, minutes, and hours pointers position change based on CSS animations, so it is a __very low__ CPU/memory intensive widget. If your computer is running a resource intensive application, the CSS might fall behind, so I've decided to set a 30 minute refresh interval.

## Usage
Edit the **_places.json_** file in the widget directory, you will need latitude (`lat`), longitude (`lng`), and timezone (`timezone`) of the clock you want to display, the possible timezones are included in the **_timezones.json_** file. These timezones are the ones available in MacOS. The `name` key is whatever you want to display on the clock face.

[Latitude and Longitude Finder](https://www.latlong.net) is a very good way to find the coordinates of almost any place.

```json
{
  "name": "México City",
  "timezone": "America/Mexico_City",
  "lat": 19.451054,
  "lng": -99.125519
}
```

## Cool stuff
- Automatic color change to dark mode if your computer is set to go into it automatically or you have it as default.
- Clock face will change color at sunrise and sunset times for each latitude/longitude.
- Smooth pointer animation.

## Todo
- Ability to resize as a percentage of the screen, while it can be done; if you are working with two screens in different sizes, it will use the percentage of only one screen.
- Show am/pm indicator for places where there's no sunset.
- Maybe a smarter grid.
- Make prettier hour, minute, second pointers.

## Screenshots

Full screenshot in dark mode

![Full screenshot in dark mode](https://github.com/rafcontreras/Ubersicht-World-Clock-Widget/raw/master/full_screenshot.png)

Resized
![Resized](https://github.com/rafcontreras/Ubersicht-World-Clock-Widget/raw/master/big_size.png)

Multiple Clocks
![Multiple Clocks](https://github.com/rafcontreras/Ubersicht-World-Clock-Widget/raw/master/multiple_clocks.png)