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
  // Custom.
  name: string;
  debug: boolean;
  height: string;
  width: string;

  // Specific to gl-plot2d.
  plotOptions: GlPlot2dOptions;
}
