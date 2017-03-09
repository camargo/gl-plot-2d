import * as skate from 'skatejs';

import * as fit from 'canvas-fit';
import * as createLine from 'gl-line2d';
import * as createPlot from 'gl-plot2d';
import * as createScatter from 'gl-scatter2d';
import * as createScatterFancy from 'gl-scatter2d-sdf';
import * as createSpikes from 'gl-spikes2d';
import { debounce } from 'lodash';

import {
  GlPlot2dComponentProps,
  GlPlot2dOptions,
  LineOptions,
  ScatterOptions,
  ScatterFancyOptions
} from './';

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
  private plot: GLPlot2D | null;              // Plot object via gl-plot2d.
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
      name: skate.prop.string({ attribute: true }),
      debug: skate.prop.boolean({ attribute: true }),
      height: skate.prop.string({ attribute: true }),
      width: skate.prop.string({ attribute: true }),
      fitViewBox: skate.prop.boolean({ attribute: true }),
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
      this.fitCanvas();
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
        case 'name':
          if (newValue) {
            this['name'] = newValue;
          }
          break;
        case 'debug':
          if (newValue) {
            this['debug'] = JSON.parse(newValue);
          }
          break;
        case 'height':
          if (newValue) {
            this['height'] = newValue;
          }
          break;
        case 'width':
          if (newValue) {
            this['width'] = newValue;
          }
          break;
        case 'fitViewBox':
          if (newValue) {
            this['fitViewBox'] = newValue;
          }
          break;
        case 'plot-options':
          if (newValue) {
            this['plotOptions'] = JSON.parse(newValue);
            this['plotOptions'].gl = this.gl;
          }
          break;
        default:
          break;
      }

      skate.emit(this, `gl-plot-2d-attr-changed-done-${this['name']}`);
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
        cursor: default;
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

        // Set the viewBox to contain the entire surrounding div if fitViewBox is true.
        if (this['fitViewBox']) {
          this['plotOptions'].viewBox = [45, 1, boundingClientRect.width - 1, boundingClientRect.height - 1];
        }
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
    if (this.plot) {
      // Make sure plot is updated with current plotOptions before drawing.
      this.plot.update(this['plotOptions']);

      if (this['debug']) {
        console.time(`draw-time-${this['name']}`);
      }

      this.plot.draw();

      if (this['debug']) {
        console.timeEnd(`draw-time-${this['name']}`);
      }

      skate.emit(this, `gl-plot-2d-draw-plot-done-${this['name']}`);
    }
    else if (this['debug']) {
      console.error('GlPlot2dComponent: drawPlot: no plot object: ', this.plot);
    }
  }

  /**
   * Helper that adds a line plot to the current plot.
   *
   * @param {LineOptions} lineOptions
   * @returns {GLLine2D}
   *
   * @memberOf GlPlot2dComponent
   */
  public addLinePlot(lineOptions: LineOptions): GLLine2D {
    return createLine(this.plot, lineOptions);
  }

  /**
   * Helper that adds a scatter plot to the current plot.
   *
   * @param {ScatterOptions} scatter
   * @returns {Scatter2D}
   *
   * @memberOf GlPlot2dComponent
   */
  public addScatterPlot(scatterOptions: ScatterOptions): Scatter2D {
    return createScatter(this.plot, scatterOptions);
  }

  /**
   * Helper that adds a scatter fancy plot to the current plot.
   *
   * @param {ScatterFancyOptions} scatterFancyOptions
   * @returns {GLScatterFancy}
   *
   * @memberOf GlPlot2dComponent
   */
  public addScatterFancyPlot(scatterFancyOptions: ScatterFancyOptions): GLScatterFancy {
    return createScatterFancy(this.plot, scatterFancyOptions);
  }

  /**
   * Event handler helper for mouse down event.
   *
   * @private
   * @param {MouseEvent} event
   *
   * @memberOf GlPlot2dComponent
   */
  private onMouseDown(event: MouseEvent): void {
    if (this.canvas && this.plot) {
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
