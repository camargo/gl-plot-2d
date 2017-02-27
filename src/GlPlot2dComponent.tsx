import * as skate from 'skatejs';

import * as fit from 'canvas-fit';
import * as createLine from 'gl-line2d';
import * as createPlot from 'gl-plot2d';
import * as createScatter from 'gl-scatter2d';
import { debounce } from 'lodash';

import { GlPlot2dComponentProps,
         GlPlot2dOptions,
         Line,
         Scatter,
         Trace } from './';

/**
 * GlPlot2dComponent class.
 *
 * @export
 * @class GlPlot2dComponent
 * @extends {skate.Component<GlPlot2dComponentProps>}
 */
export class GlPlot2dComponent extends skate.Component<GlPlot2dComponentProps> {
  private gl: WebGLRenderingContext | null;   // WebGL Context.
  private canvas: HTMLCanvasElement | null;   // Canvas element we render to.
  private plot: any | null;                   // Plot object via gl-plot2d.

  /**
   * Custom properties that should be defined on the element. These are set up in the constructor.
   *
   * @readonly
   * @static
   * @type {skate.ComponentProps<GlPlot2dComponent, GlPlot2dComponentProps>}
   * @memberOf GlPlot2dComponent
   */
  static get props(): skate.ComponentProps<GlPlot2dComponent, GlPlot2dComponentProps> {
    return {
      // Custom.
      traces: skate.prop.array<GlPlot2dComponent, Trace>({
        attribute: true,
        coerce(traces) {
          // Turn (or "coerce") each trace into a Trace object.
          return traces.map((trace: Trace) => {
            return new Trace(trace.mode,
                             trace.positions,
                             trace.min,
                             trace.max,
                             trace.line,
                             trace.scatter);
          });
        }
      }),
      debug: skate.prop.boolean({ attribute: true }),
      height: skate.prop.string({ attribute: true }),
      width: skate.prop.string({ attribute: true }),

      // Specific to gl-plot2d.
      plotOptions: skate.prop.object<GlPlot2dComponent, GlPlot2dOptions>({ attribute: true })
    };
  }

  /**
   * Function that is called after the element has been inserted to the document.
   *
   * @memberOf GlPlot2dComponent
   */
  public connectedCallback(): void {
    super.connectedCallback();
  }

  /**
   * Function that is called to render the element.
   *
   * @returns {JSX.Element[]}
   *
   * @memberOf GlPlot2dComponent
   */
  public renderCallback(): JSX.Element[] {
    return ([
      <style>
        {this.getStyles()}
      </style>,
      <div>
        <canvas />
      </div>
    ]);
  }

  /**
   * Called after the component has rendered (i.e. called renderCallback()).
   *
   * @memberOf GlPlot2dComponent
   */
  public renderedCallback(): void {
    if (this.shadowRoot && !this.canvas) {
      this.canvas = this.shadowRoot.querySelector('canvas');
      this.initResize();
      this.initPlot();
    }
  }

  /**
   * Function that is called when an attribute changes value (added, updated or removed).
   *
   * @param {string} name
   * @param {(null | string)} oldValue
   * @param {(null | string)} newValue
   *
   * @memberOf GlPlot2dComponent
   */
  public attributeChangedCallback(name: string, oldValue: null | string, newValue: null | string): void {
    super.attributeChangedCallback(name, oldValue, newValue);

    if (this.gl && this.plot) {
      switch (name) {
        case 'plot-options':
          if (newValue) {
            this['plotOptions'] = JSON.parse(newValue);
            this['plotOptions'].gl = this.gl;
          }
          break;
        default:
          break;
      }

      this.plot.update(this['plotOptions']);
      this.drawPlot();
    }
  }

  /**
   * Function that is called after the element has been removed from the document.
   *
   * @memberOf GlPlot2dComponent
   */
  public disconnectedCallback(): void {
    super.disconnectedCallback();

    if (this.plot) {
      this.plot.dispose();
    }
  }

  /**
   * Helper that returns the styles for this component.
   *
   * @returns {string}
   *
   * @memberOf GlPlot2dComponent
   */
  public getStyles(): string {
    const width = this['width'];
    const height = this['height'];

    const styles = `
      div {
        width: ${width};
        height: ${height};
      }

      canvas {
        position: relative !important;
      }
    `;

    return styles;
  }

  /**
   * Resize function that uses canvas-fit.
   * Sets the viewBox to contain the entire containing div.
   *
   * @memberOf GlPlot2dComponent
   */
  public resize(): void {
    // Setup fit().
    const resize = fit(this.canvas, null, +window.devicePixelRatio);

    if (this.shadowRoot) {
      // Get the div around the canvas.
      let div = this.shadowRoot.querySelector('div');

      if (div) {
        let boundingClientRect = div.getBoundingClientRect();
        this['plotOptions'].viewBox = [50, 1, boundingClientRect.width - 1, boundingClientRect.height - 1];
      }
    }

    // Resize after setting up fit().
    resize();
  }

  /**
   * Helper function that initializes resize canvas logic.
   * Should be only called once on component initialization.
   *
   * @memberOf GlPlot2dComponent
   */
  public initResize(): void {
    this.resize();

    // Debounce the resize call.
    const debounceResize = debounce(() => {
      this.resize();

      if (this.plot) {
        this.plot.update(this['plotOptions']);
        this.drawPlot();
      }
    }, 200);

    // Setup resize event listener.
    window.addEventListener('resize', debounceResize, false);
  }

  /**
   * Helper function that initializes the plot.
   *
   * @returns {void}
   *
   * @memberOf GlPlot2dComponent
   */
  public initPlot(): void {
    if (this.canvas) {
      this.gl = this.canvas.getContext('webgl');
    }
    else {
      if (this['debug']) {
        console.error('GlPlot2dComponent: initAndDrawPlot: No canvas: ', this.canvas);
      }
      return;
    }

    if (!this.gl) {
      if (this['debug']) {
        console.error('GlPlot2dComponent: initAndDrawPlot: No gl: ', this.gl);
      }
      return;
    }

    this['plotOptions'].gl = this.gl;

    this.plot = createPlot(this['plotOptions']);

    this['traces'].forEach((trace: Trace) => {
      if (trace.line) {
        this.addLinePlot(trace.positions, trace.line);
      }
      else if (trace.scatter) {
        this.addScatterPlot(trace.positions, trace.scatter);
      }
    });

    skate.emit(this, 'gl-plot-2d-init-plot-done');
  }

  /**
   * Helper tha draws the plot.
   *
   * @memberOf GlPlot2dComponent
   */
  public drawPlot(): void {
    if (this['debug']) {
      console.time('drawTime');
    }

    this.plot.draw();

    if (this['debug']) {
      console.timeEnd('drawTime');
    }

    skate.emit(this, 'gl-plot-2d-draw-plot-done');
  }

  /**
   * Helper that adds a line plot to the current plot.
   *
   * @param {number[]} positions
   * @param {Line} line
   *
   * @memberOf GlPlot2dComponent
   */
  public addLinePlot(positions: number[], line: Line): void {
    createLine(this.plot, {
      positions: new Float32Array(positions),
      color: line.color,
      fill: line.fill,
      fillColor: line.fillColor,
      width: line.width
    });
  }

  /**
   * Helper that adds a scatter plot to the current plot.
   *
   * @param {number[]} positions
   * @param {Scatter} scatter
   *
   * @memberOf GlPlot2dComponent
   */
  public addScatterPlot(positions: number[], scatter: Scatter): void {
    createScatter(this.plot, {
      positions: new Float32Array(positions),
      size: scatter.size,
      color: scatter.color,
      borderSize: scatter.borderSize,
      borderColor: scatter.borderColor
    });
  }
}

/**
 * Helper definition function for GlPlot2d.
 *
 * @export
 * @param {string} [name]
 * @returns {*}
 */
export function defineGlPlot2d(name?: string): any {
  if (!name) {
    name = 'gl-plot-2d';
  }

  customElements.define(name, GlPlot2dComponent);

  return customElements.get(name);
}
