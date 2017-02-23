
import { Tick, Trace } from './';

/**
 * GlPlot2dComponentProps.
 *
 * These are the properties for the gl-plot-2d web component.
 *
 * Note this is not the same as the options for gl-plot2d as the
 * web component exposes more custom functionality.
 *
 * @export
 * @interface GlPlot2dComponentProps
 */
export interface GlPlot2dComponentProps {
  // Custom.
  traces: Trace[];
  width: string;
  height: string;
  debug: boolean;

  // General.
  pixelRatio: number;
  screenBox: number[] | null;
  dataBox: number[] | null;
  viewBox: number[] | null;

  // Title.
  titleEnable: boolean;
  title: string;
  titleCenter: number[];
  titleAngle: number;
  titleColor: number[];
  titleFont: string;
  titleSize: number;

  // Background color.
  backgroundColor: number[];

  // Border.
  borderColor: number[];
  borderLineEnable: boolean[];
  borderLineWidth: number[];
  borderLineColor: number[][];

  // Labels.
  labels: string[];
  labelEnable: boolean[];
  labelAngle: number[];
  labelPad: number[];
  labelSize: number[];
  labelFont: string[];
  labelColor: number[][];

  // Ticks.
  ticks: Tick[][];
  tickEnable: boolean[];
  tickPad: number[];
  tickAngle: number[];
  tickColor: number[][];
  tickMarkWidth: number[];
  tickMarkLength: number[];
  tickMarkColor: number[][];

  // Grid lines.
  gridLineEnable: boolean[];
  gridLineColor: number[][];
  gridLineWidth: number[];

  // Zero lines.
  zeroLineEnable: boolean[];
  zeroLineColor: number[][];
  zeroLineWidth: number[];
}
