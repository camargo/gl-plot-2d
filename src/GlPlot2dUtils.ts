import * as d3Scale from 'd3-scale';
import { round } from 'lodash';

import { Point,
         PointPair,
         Tick,
         TickListPair } from './';

/**
 * Helper function to make count linear tick marks on domain lo to hi.
 * Uses d3-scale to do so.
 * Coerces tick number[] to Tick[].
 *
 * @export
 * @param {number} lo
 * @param {number} hi
 * @param {number} precision
 * @param {boolean} nice
 * @returns {Tick[]}
 *
 * @memberOf GlPlot2dComponent
 */
export function getLinearTicks(lo: number,
                               hi: number,
                               precision: number,
                               nice: boolean): Tick[] {
  let scale = d3Scale.scaleLinear()
                     .domain([Math.floor(lo), Math.ceil(hi)]);

  if (nice) {
    scale = scale.nice();
  }

  const ticks = scale.ticks();

  return ticks.map((tick: number) => new Tick(round(tick, precision)));
}

/**
 * Helper function to make count log tick marks on domain lo to hi.
 * Uses d3-scale to do so.
 * Coerces tick number[] to Tick[].
 *
 * @export
 * @param {number} lo
 * @param {number} hi
 * @param {number} precision
 * @param {boolean} nice
 * @returns {Tick[]}
 *
 * @memberOf GlPlot2dComponent
 */
export function getLogTicks(lo: number,
                            hi: number,
                            precision: number,
                            nice: boolean): Tick[] {
  let scale = d3Scale.scaleLog()
                     .domain([Math.max(1.0, Math.floor(lo)), Math.ceil(hi)]);

  if (nice) {
    scale = scale.nice();
  }

  const ticks = scale.ticks();

  return ticks.map((tick: number) => new Tick(round(tick, precision)));
}

/**
 * Helper that makes random positions for testing purposes.
 *
 * @export
 * @param {number} count
 * @param {number} xRange
 * @returns {number[]}
 */
export function makeRandomPositions(count: number, xRange: number): number[] {
  const positions: number[] = [];

  for (let i = 0; i < 2 * count; i += 2) {
    positions[i] = (i / count) * xRange - xRange;

    // Samples the standard normal distribution, with 0 mean and unit standard deviation.
    // See https://github.com/scijs/gauss-random.
    positions[i + 1] = Math.sqrt(-2.0 * Math.log(Math.random())) * Math.cos(2.0 * Math.PI * Math.random());
  }

  return positions;
}

/**
 * Get a component-wise min point from a list of points.
 *
 * @export
 * @param {Point[]} points
 * @returns {Point}
 */
export function getMinFromPoints(points: Point[]): Point {
  let min: Point = new Point(Number.MAX_SAFE_INTEGER, Number.MAX_SAFE_INTEGER);

  if (points.length > 1) {
    points.forEach((point: Point) => {
      if (point.x < min.x) { min.x = point.x; }
      if (point.y < min.y) { min.y = point.y; }
    });
  }
  else if (points.length === 1) {
    min = points[0];
  }

  return min;
}

/**
 * Get a component-wise max point from a list of points.
 *
 * @export
 * @param {Point[]} points
 * @returns {Point}
 */
export function getMaxFromPoints(points: Point[]): Point {
  let max: Point = new Point(Number.MIN_SAFE_INTEGER, Number.MIN_SAFE_INTEGER);

  if (points.length > 1) {
    points.forEach((point: Point) => {
      if (point.x > max.x) { max.x = point.x; }
      if (point.y > max.y) { max.y = point.y; }
    });
  }
  else if (points.length === 1) {
    max = points[0];
  }

  return max;
}

/**
 * Get a min point out of a list of positions.
 * Assumes (x, y) values are packed in a single positions array such that
 * x === positions[i] and y === positions[i + 1].
 *
 * @export
 * @param {number[]} positions
 * @returns {Point}
 */
export function getMinFromPositions(positions: number[]): Point {
  let minX = Number.MAX_SAFE_INTEGER;
  let minY = Number.MAX_SAFE_INTEGER;

  for (let i = 0; i < positions.length; i += 2) {
    if (positions[i] < minX) { minX = positions[i]; }
    if (positions[i + 1] < minY) { minY = positions[i + 1]; }
  }

  return new Point(minX, minY);
}

/**
 * Get a max point out of a list of positions.
 * Assumes (x, y) values are packed in a single positions array such that
 * x === positions[i] and y === positions[i + 1].
 *
 * @export
 * @param {number[]} positions
 * @returns {Point}
 */
export function getMaxFromPositions(positions: number[]): Point {
  let maxX = Number.MIN_SAFE_INTEGER;
  let maxY = Number.MIN_SAFE_INTEGER;

  for (let i = 0; i < positions.length; i += 2) {
    if (positions[i] > maxX) { maxX = positions[i]; }
    if (positions[i + 1] > maxY) { maxY = positions[i + 1]; }
  }

  return new Point(maxX, maxY);
}

/**
 * Gets ticks by type.
 * Supported types are linear, log, and pow.
 *
 * @export
 * @param {PointPair} minMax
 * @param {string} type
 * @param {number} precision
 * @param {boolean} nice
 * @returns {TickListPair}
 */
export function getTicks(minMax: PointPair,
                         type: string,
                         precision: number,
                         nice: boolean): TickListPair {
  let xTicks: Tick[] = [];
  let yTicks: Tick[] = [];

  if (type === 'linear') {
    xTicks = getLinearTicks(minMax.p1.x, minMax.p2.x, precision, nice);
    yTicks = getLinearTicks(minMax.p1.y, minMax.p2.y, precision, nice);
  }
  else if (type === 'log') {
    xTicks = getLogTicks(minMax.p1.x, minMax.p2.x, precision, nice);
    yTicks = getLogTicks(minMax.p1.y, minMax.p2.y, precision, nice);
  }

  return new TickListPair(xTicks, yTicks);
}
