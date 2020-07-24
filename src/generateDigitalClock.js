const generateDigitalClock = (time) => {
  const getDigits = (num, name) => {
    const str = num
      .toLocaleString("en-US", {
        minimumIntegerDigits: 2,
        useGrouping: false,
      })
      .split("")
      .map((item, index) => {
        const suffix = index === 0 ? "Ones" : "Tens";
        return {
          label: `${name}${suffix}`,
          value: Number(item),
        };
      });
    return str;
  };

  const now = time;
  const seconds = getDigits(now.getSeconds(), "second");
  const minutes = getDigits(now.getMinutes(), "minute");
  const hours = getDigits(now.getHours(), "hour");

  const initial = {
    secondOnes: seconds[1],
    secondTens: seconds[0],
    minuteOnes: minutes[1],
    minuteTens: minutes[0],
    hourOnes: hours[1],
    hourTens: hours[0],
  };

  const generateArray = (arrayLength, label) => {
    const array = [...Array(arrayLength).keys()];
    const currentValue = initial[label].value;

    const currentIndex = array.findIndex((item) => item === currentValue || 0);
    const end = array.slice(0, currentIndex);
    const start = array.slice(currentIndex);
    const currentArray = [...start, ...end];

    return currentArray;
  };

  const digits = [
    {
      label: "hour",
      suffix: "Tens",
      arrayLength: 3,
      keyframe: "three",
      duration: "108000s",
    },
    {
      label: "hour",
      suffix: "Ones",
      arrayLength: 10,
      keyframe: "ten",
      duration: "36000s",
    },
    {
      label: "minute",
      suffix: "Tens",
      arrayLength: 6,
      keyframe: "six",
      duration: "3600s",
    },
    {
      label: "minute",
      suffix: "Ones",
      arrayLength: 10,
      keyframe: "ten",
      duration: "600s",
    },
    {
      label: "second",
      suffix: "Tens",
      arrayLength: 6,
      keyframe: "six",
      duration: "60s",
    },
    {
      label: "second",
      suffix: "Ones",
      arrayLength: 10,
      keyframe: "ten",
      duration: "10s",
    },
  ].map((digit) => {
    const newSeconds = now.getSeconds();
    const newMinutes = now.getMinutes();
    const newHours = now.getHours();
    const { label, arrayLength, type, suffix } = digit;
    digit.numbers = generateArray(arrayLength, `${label}${suffix}`);
    const fullLabel = `${label}${suffix}`;
    let delay = "";
    const secondsModulo = newSeconds % 10;
    const secondsFloor = Math.floor(newSeconds / 10);
    const minutesModulo = newMinutes % 10;
    const minutesFloor = Math.floor(newMinutes / 10);
    const hoursModulo = newHours % 10;
    const hoursFloor = Math.floor(newHours / 10);
    if (fullLabel === "secondOnes") {
      delay = 0;
    }
    if (fullLabel === "secondTens") {
      delay = secondsModulo; // ok
    }
    if (fullLabel === "minuteOnes") {
      delay = 10 * secondsFloor + secondsModulo; //ok
    }
    if (fullLabel === "minuteTens") {
      delay = 60 * minutesModulo + 10 * minutesFloor + secondsModulo; // ok
    }
    if (fullLabel === "hourOnes") {
      delay =
        600 * minutesFloor +
        60 * minutesModulo +
        10 * secondsFloor +
        secondsModulo; //ok
    }
    if (fullLabel === "hourTens") {
      delay =
        3600 * hoursModulo +
        600 * minutesFloor +
        60 * minutesModulo +
        10 * secondsFloor +
        secondsModulo;
    }
    digit.delay = delay;
    return digit;
  });

  return digits;
};

export default generateDigitalClock;
