import { GlPlot2dOptions } from './';

/**
 * GlPlot2dComponentProps.
 *
 * These are the properties for the gl-plot-2d web component.
 *
 * @export
 * @interface GlPlot2dComponentProps
 */
export interface GlPlot2dComponentProps {
  name: string;
  debug: boolean;
  height: string;
  width: string;
  canvasTop: string;
  fitViewBox: boolean;
  plotOptions: GlPlot2dOptions; // Specific to gl-plot2d.
}
