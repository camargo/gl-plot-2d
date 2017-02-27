import { GlPlot2dOptions, Trace } from './';

/**
 * GlPlot2dComponentProps.
 *
 * These are the properties for the gl-plot-2d web component.
 *
 * @export
 * @interface GlPlot2dComponentProps
 */
export interface GlPlot2dComponentProps {
  // Custom.
  traces: Trace[];
  debug: boolean;
  height: string;
  width: string;

  // Specific to gl-plot2d.
  plotOptions: GlPlot2dOptions;
}
