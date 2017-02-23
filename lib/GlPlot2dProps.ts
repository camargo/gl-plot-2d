
import { Tick, Trace } from './';

/**
 * GlPlot2dProps.
 *
 * @export
 * @interface GlPlot2dProps
 */
export interface GlPlot2dProps {
  // General.
  data: Trace[];

  pixelRatio: number;
  screenBox: number[] | null;
  dataBox: number[] | null;
  viewBox: number[] | null;
  debug: boolean;

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
