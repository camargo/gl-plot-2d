import * as d3Scale from 'd3-scale';
import { round } from 'lodash';

import { Point, PointPair, Tick, TickListPair, Trace } from './';

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
 * Helper function to make count pow tick marks on domain lo to hi.
 * Uses d3-scale to do so.
 * Coerces tick number[] to Tick[].
 *
 * @export
 * @param {number} lo
 * @param {number} hi
 * @param {number} precision
 * @param {boolean} nice
 * @param {number} exponent
 * @returns {Tick[]}
 */
export function getPowTicks(lo: number,
                            hi: number,
                            precision: number,
                            nice: boolean,
                            exponent: number): Tick[] {
  let scale = d3Scale.scalePow()
                     .exponent(exponent)
                     .domain([lo, hi]);

  if (nice) {
    scale = scale.nice();
  }

  const ticks = scale.ticks();

  return ticks.map((tick: number) => new Tick(round(tick, precision)));
}

/**
 * Helper function that finds global min and max points from a list of traces.
 *
 * @export
 * @param {Trace[]} traces
 * @returns {PointPair}
 */
export function getMinMax(traces: Trace[]): PointPair {
  let p1: Point = new Point(Number.MAX_SAFE_INTEGER, Number.MAX_SAFE_INTEGER);
  let p2: Point = new Point(Number.MIN_SAFE_INTEGER, Number.MIN_SAFE_INTEGER);

  if (traces.length > 1) {
    traces.forEach((trace: Trace) => {
      if (trace.min.x < p1.x) { p1.x = trace.min.x; }
      if (trace.min.y < p1.y) { p1.y = trace.min.y; }

      if (trace.max.x > p2.x) { p2.x = trace.max.x; }
      if (trace.max.y > p2.y) { p2.y = trace.max.y; }
    });
  }
  else if (traces.length === 1) {
    p1 = traces[0].min;
    p2 = traces[0].max;
  }

  return new PointPair(p1, p2);
}

/**
 * Helper that gets random positions.
 * Also returns min and max coordinates from positions: (minX, minY) and (maxX, maxY).
 *
 * @export
 * @param {number} count
 * @returns {*}
 */
export function getRandomPositions(count: number): any {
  const positions: number[] = [];
  let minX = Number.MAX_SAFE_INTEGER;
  let minY = Number.MAX_SAFE_INTEGER;
  let maxX = Number.MIN_SAFE_INTEGER;
  let maxY = Number.MIN_SAFE_INTEGER;

  for (let i = 0; i < 2 * count; i += 2) {
    positions[i] = (i / count) * 20 - 20;

    // Samples the standard normal distribution, with 0 mean and unit standard deviation.
    // See https://github.com/scijs/gauss-random.
    positions[i + 1] = Math.sqrt(-2.0 * Math.log(Math.random())) * Math.cos(2.0 * Math.PI * Math.random());

    if (positions[i] < minX) { minX = positions[i]; }
    if (positions[i + 1] < minY) { minY = positions[i + 1]; }

    if (positions[i] > maxX) { maxX = positions[i]; }
    if (positions[i + 1] > maxY) { maxY = positions[i + 1]; }
  }

  return {
    positions,
    min: new Point(minX, minY),
    max: new Point(maxX, maxY)
  };
}

/**
 * Gets ticks by type.
 * Supported types are linear, log, and pow.
 *
 * @export
 * @param {Trace[]} traces
 * @param {string} type
 * @param {number} precision
 * @param {boolean} nice
 * @param {number} exponent
 * @returns {TickListPair}
 */
export function getTicks(traces: Trace[],
                         type: string,
                         precision: number,
                         nice: boolean,
                         exponent: number): TickListPair {
  const minMax = getMinMax(traces);

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
  else if (type === 'pow') {
    xTicks = getPowTicks(minMax.p1.x, minMax.p2.x, precision, nice, exponent);
    yTicks = getPowTicks(minMax.p1.y, minMax.p2.y, precision, nice, exponent);
  }

  return new TickListPair(xTicks, yTicks);
}
