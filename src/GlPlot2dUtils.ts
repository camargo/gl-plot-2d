
import * as d3Scale from 'd3-scale';
import { round } from 'lodash';

import { Point, PointPair, Tick, TickListPair, Trace } from './';

/**
 * Helper function that finds global min and max points from a list of traces.
 *
 * @export
 * @param {Trace[]} traces
 * @returns {PointPair}
 */
export function findMinMax(traces: Trace[]): PointPair {
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
 * Gets ticks by type.
 * Supported types are linear and log.
 *
 * @export
 * @param {Trace[]} traces
 * @param {string} type
 * @param {number} precision
 * @param {boolean} nice
 * @returns {TickListPair}
 */
export function getTicks(traces: Trace[],
                         type: string,
                         precision: number,
                         nice: boolean): TickListPair {
  const minMax = findMinMax(traces);

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
                     .domain([Math.max(1, Math.floor(lo)), Math.ceil(hi)]);

  if (nice) {
    scale = scale.nice();
  }

  const ticks = scale.ticks();

  return ticks.map((tick: number) => new Tick(round(tick, precision)));
}
