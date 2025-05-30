import { APCAcontrast, sRGBtoY } from 'apca-w3';
import { colorParsley } from 'colorparsley'

/**
 * Calculates the APCA contrast between two colors.
 * @param {string} foreground - The foreground color (e.g., '#RRGGBB' or 'rgb(R,G,B)')
 * @param {string} background - The background color (e.g., '#RRGGBB' or 'rgb(R,G,B)')
 * @returns {number} The APCA contrast value.
 */
export function getApcaContrast(foreground, background) {
  // APCA expects colors as strings. Make sure they are valid CSS color strings.
  // The apca-w3 library handles various input formats, but hex or rgb/rgba are common.
  return APCAcontrast(sRGBtoY(colorParsley(foreground)), sRGBtoY(colorParsley(background)));
}

/**
 * Helper to determine if a contrast value meets a certain threshold.
 * This is a simplification; real APCA guidelines are more nuanced.
 * @param {number} contrastValue - The APCA contrast value.
 * @param {number} threshold - The desired minimum contrast.
 * @returns {boolean} True if contrast meets or exceeds threshold.
 */
export function meetsContrastThreshold(contrastValue, threshold) {
  // APCA values can be positive or negative depending on luminance difference.
  // For most practical purposes, we care about the absolute value for sufficient contrast.
  return Math.abs(contrastValue) >= threshold;
}

// You might add more utility functions here based on specific APCA guidelines
// e.g., for different text sizes, bolding, etc.