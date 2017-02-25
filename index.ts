
import 'skatejs-web-components';

import {
  GlPlot2dComponent,
  findMinMax,
  getTicks,
  getLinearTicks,
  getLogTicks
} from './src';

export { findMinMax, getTicks, getLinearTicks, getLogTicks };

customElements.define('gl-plot-2d', GlPlot2dComponent);
