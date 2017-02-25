
/**
 * Helper that makes dummy positions.
 * Also returns two coordinates from positions: (minX, minY) and (maxX, maxY).
 *
 * @export
 * @param {any} count
 * @returns
 */
export function makePositions(count) {
  let positions = [];
  let minX = Number.MAX_SAFE_INTEGER;
  let minY = Number.MAX_SAFE_INTEGER;
  let maxX = Number.MIN_SAFE_INTEGER;
  let maxY = Number.MIN_SAFE_INTEGER;

  for (let i = 0; i < 2 * count; i += 2) {
    positions[i]   = (i / count) * 20 - 20;
    positions[i+1] = Math.sqrt(-2.0 * Math.log(Math.random())) * Math.cos(2.0 * Math.PI * Math.random());

    if (positions[i] < minX) { minX = positions[i]; }
    if (positions[i+1] < minY) { minY = positions[i+1]; }

    if (positions[i] > maxX) { maxX = positions[i]; }
    if (positions[i+1] > maxY) { maxY = positions[i+1]; }
  }

  return {
    positions,
    minX,
    minY,
    maxX,
    maxY
  }
}
