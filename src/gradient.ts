import chalk from "chalk";

import ora from "ora";

const gradientColors: string[] = [
  `#ff5e00`,
  `#ff4c29`,
  `#ff383f`,
  `#ff2453`,
  `#ff0565`,
  `#ff007b`,
  `#f5008b`,
  `#e6149c`,
  `#d629ae`,
  `#c238bd`,
];

export const rocketAscii = "■■▶";

// get a reference to scroll through while loading
// visual representation of what this generates:
// gradientColors: "..xxXX"
// referenceGradient: "..xxXXXXxx....xxXX"
const referenceGradient: string[] = [
  ...gradientColors,
  // draw the reverse of the gradient without
  // accidentally mutating the gradient (ugh, reverse())
  ...[...gradientColors].reverse(),
  ...gradientColors,
];

/**
 * Generates the frames for a gradient animation.
 *
 * @return {string[]} An array of strings representing the frames of the animation.
 */
export function getGradientAnimFrames() {
  const frames: string[] = [];
  for (let start = 0; start < gradientColors.length * 2; start++) {
    const end = start + gradientColors.length - 1;
    frames.push(
      referenceGradient
        .slice(start, end)
        .map((g) => chalk.bgHex(g as string)(" "))
        .join("")
    );
  }
  return frames;
}

// function sleep(time: number) {
//     return new Promise((resolve) => {
//         setTimeout(resolve, time);
//     });
// }
//
// function getIntroAnimFrames() {
//     const frames = [];
//     for (let end = 1; end <= gradientColors.length; end++) {
//         const leadingSpacesArr = Array.from(
//             new Array(Math.abs(gradientColors.length - end - 1)),
//             () => " "
//         );
//         const gradientArr = gradientColors
//             .slice(0, end)
//             .map((g) => chalk.bgHex(g)(" "));
//         frames.push([...leadingSpacesArr, ...gradientArr].join(""));
//     }
//     return frames;
// }

/**
 * Generate loading spinner with rocket flames!
 * @param text display text next to rocket
 * @returns Ora spinner for running .stop()
 */
export const loadWithRocketGradient = (text: string) =>
  ora({
    spinner: {
      interval: 80,
      frames: getGradientAnimFrames(),
    },
    text: `${rocketAscii} ${text}`,
  });
