import * as skate from 'skatejs';

import * as fit from 'canvas-fit';
import * as createLine from 'gl-line2d';
import * as createPlot from 'gl-plot2d';
import * as createScatter from 'gl-scatter2d';
import * as createScatterFancy from 'gl-scatter2d-sdf';
import * as createSpikes from 'gl-spikes2d';
import { debounce } from 'lodash';

import { GlPlot2dComponentProps,
         GlPlot2dOptions,
         Line,
         Scatter,
         ScatterFancy,
         Trace } from './';

/**
 * GlPlot2dComponent class.
 *
 * @export
 * @class GlPlot2dComponent
 * @extends {skate.Component<GlPlot2dComponentProps>}
 */
export class GlPlot2dComponent extends skate.Component<GlPlot2dComponentProps> {
  private canvas: HTMLCanvasElement | null;   // Canvas element we render to.
  private gl: WebGLRenderingContext | null;   // WebGL Context.
  private plot: any | null;                   // Plot object via gl-plot2d.
  private spikes: any | null;                 // Spikes object via gl-spikes2d.

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
      name: skate.prop.string({ attribute: true }),
      traces: skate.prop.array<GlPlot2dComponent, Trace>({
        attribute: true,
        coerce(traces) {
          // Turn (or "coerce") each trace into a Trace object.
          return traces.map((trace: Trace) => {
            return new Trace(trace.mode,
                             trace.min,
                             trace.max,
                             trace.line,
                             trace.scatter,
                             trace.scatterFancy);
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
    if (this.shadowRoot && !this.canvas && !this.plot) {
      this.canvas = this.shadowRoot.querySelector('canvas');

      this.initGl();
      this.initEventHandlers();
      this.initPlot();
      this.fitCanvas();
      this.drawPlot();
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
          }
          break;
        default:
          break;
      }

      this['plotOptions'].gl = this.gl;
      this.fitCanvas();
      this.drawPlot();
    }
  }

  /**
   * Function that is called after the element has been removed from the document.
   * Items are destroyed in the reverse-order from which they are initialized.
   *
   * @memberOf GlPlot2dComponent
   */
  public disconnectedCallback(): void {
    super.disconnectedCallback();

    if (this.spikes) {
      this.spikes.dispose();
    }

    if (this.plot) {
      this.plot.dispose();
    }

    if (this.gl) {
      this.gl = null;
    }

    if (this.canvas) {
      this.canvas = null;
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
    const styles = `
      div {
        width: ${this['width']};
        height: ${this['height']};
      }

      canvas {
        position: relative !important;
      }
    `;

    return styles;
  }

  /**
   * Helper to initialize WebGL context.
   *
   * @returns {void}
   *
   * @memberOf GlPlot2dComponent
   */
  public initGl(): void {
    if (this.canvas) {
      this.gl = this.canvas.getContext('webgl');
    }
    else {
      if (this['debug']) {
        console.error('GlPlot2dComponent: initGl: No canvas: ', this.canvas);
      }
      return;
    }

    if (!this.gl) {
      if (this['debug']) {
        console.error('GlPlot2dComponent: initGl: No gl: ', this.gl);
      }
      return;
    }
  }

  /**
   * Helper function that initializes event handlers.
   * Should be only called once on component initialization.
   *
   * @memberOf GlPlot2dComponent
   */
  public initEventHandlers(): void {
    // Debounce the resize call.
    const debounceResize = debounce(() => {
      this.fitCanvas();
      this.drawPlot();
    }, 200);

    // Setup debounced window resize event listener.
    window.addEventListener('resize', debounceResize, false);

    // Register canvas interaction events.
    if (this.canvas) {
      this.canvas.onmousedown = (event: MouseEvent) => {
        this.onMouseDown(event);
      };

      this.canvas.onmouseup = () => {
        // console.info('onmouseup: ', event);
        // TODO.
      };

      this.canvas.onmousemove = () => {
        // console.info('onmousemove: ', event);
        // TODO.
      };

      this.canvas.onmouseover = () => {
        // console.info('onmouseover: ', event);
        // TODO.
      };
    }
  }

  /**
   * Helper function that initializes the plot.
   *
   * @returns {void}
   *
   * @memberOf GlPlot2dComponent
   */
  public initPlot(): void {
    this['plotOptions'].gl = this.gl;
    this.plot = createPlot(this['plotOptions']);
    this.spikes = createSpikes(this.plot);

    this['traces'].forEach((trace: Trace) => {
      if (trace.line) {
        this.addLinePlot(trace.line);
      }
      else if (trace.scatter) {
        this.addScatterPlot(trace.scatter);
      }
      else if (trace.scatterFancy) {
        this.addScatterFancyPlot(trace.scatterFancy);
      }
    });

    skate.emit(this, `gl-plot-2d-init-plot-done-${this['name']}`);
  }

  /**
   * Resize fit canvas function that uses canvas-fit.
   * Sets the viewBox to contain the entire surrounding div.
   *
   * @memberOf GlPlot2dComponent
   */
  public fitCanvas(): void {
    // Setup fit().
    const resize = fit(this.canvas, null, +window.devicePixelRatio);

    if (this.shadowRoot) {
      // Get the div around the canvas.
      const div = this.shadowRoot.querySelector('div');

      if (div) {
        const boundingClientRect = div.getBoundingClientRect();

        // Set the viewBox to contain the entire surrounding div.
        // TODO: Parameterize the viewBox.
        this['plotOptions'].viewBox = [50, 1, boundingClientRect.width - 1, boundingClientRect.height - 1];
      }
    }

    // Trigger resize.
    resize();
  }

  /**
   * Helper tha draws the plot.
   *
   * @memberOf GlPlot2dComponent
   */
  public drawPlot(): void {
    // Make sure plot is updated with current plotOptions before drawing.
    this.plot.update(this['plotOptions']);

    if (this['debug']) {
      console.time('drawTime');
    }

    this.plot.draw();

    if (this['debug']) {
      console.timeEnd('drawTime');
    }

    skate.emit(this, `gl-plot-2d-draw-plot-done-${this['name']}`);
  }

  /**
   * Helper that adds a line plot to the current plot.
   *
   * @param {Line} line
   *
   * @memberOf GlPlot2dComponent
   */
  public addLinePlot(line: Line): void {
    createLine(this.plot, {
      positions: line.positions,
      color: line.color,
      fill: line.fill,
      fillColor: line.fillColor,
      width: line.width
    });
  }

  /**
   * Helper that adds a scatter plot to the current plot.
   *
   * @param {Scatter} scatter
   *
   * @memberOf GlPlot2dComponent
   */
  public addScatterPlot(scatter: Scatter): void {
    createScatter(this.plot, {
      positions: scatter.positions,
      size: scatter.size,
      color: scatter.color,
      borderSize: scatter.borderSize,
      borderColor: scatter.borderColor
    });
  }

  /**
   * Helper that adds a scatter fancy plot to the current plot.
   *
   * @param {ScatterFancy} scatterFancy
   *
   * @memberOf GlPlot2dComponent
   */
  public addScatterFancyPlot(scatterFancy: ScatterFancy): void {
    createScatterFancy(this.plot, {
      positions: scatterFancy.positions,
      sizes: scatterFancy.sizes,
      colors: scatterFancy.colors,
      glyphs: scatterFancy.glyphs,
      borderWidths: scatterFancy.borderWidths,
      borderColors: scatterFancy.borderColors
    });
  }

  /**
   * Event handler helper for mouse down event.
   *
   * @private
   * @param {MouseEvent} event
   *
   * @memberOf GlPlot2dComponent
   */
  private onMouseDown(event: MouseEvent): void  {
    if (this. canvas) {
      const canvasBoundingRect = this.canvas.getBoundingClientRect();
      const x = event.clientX - canvasBoundingRect.left;
      const y = Math.abs(event.clientY - canvasBoundingRect.top - canvasBoundingRect.height);

      const result = this.plot.pick(x / this.plot.pixelRatio, y / this.plot.pixelRatio);

      if (result) {
        this.spikes.update({ center: result.dataCoord });
      }
      else {
        this.spikes.update();
      }

      this.drawPlot();
    }
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
