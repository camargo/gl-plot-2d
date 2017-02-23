import 'skatejs-web-components';
import * as skate from 'skatejs';

import { debounce } from 'lodash';
import * as fit from 'canvas-fit';
import * as gaussRandom from 'gauss-random';
import * as createScatter from 'gl-scatter2d';
import * as createScatterFancy from 'gl-scatter2d-fancy';
import * as createLine from 'gl-line2d';
import * as createPlot from 'gl-plot2d';

import { GlPlot2dComponentProps,
         GlPlot2dOptions,
         Line,
         Scatter,
         Tick,
         Trace } from './lib';

/**
 * GlPlot2dComponent class.
 *
 * @export
 * @class GlPlot2dComponent
 * @extends {skate.Component<GlPlot2dComponentProps>}
 */
export default class GlPlot2dComponent extends skate.Component<GlPlot2dComponentProps> {
  private gl: WebGLRenderingContext | null; // WebGL Context.
  private canvas: HTMLCanvasElement | null; // Canvas element we render to.
  private plot: any;                        // Plot object via gl-plot2d.
  private options: GlPlot2dOptions;         // Plot options for gl-plot2d.

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
        coerce (traces) {
          return traces.map(trace => new Trace(trace.mode, trace.positions, trace.positionCount, trace.line, trace.scatter));
        }
      }),
      width: skate.prop.string({ attribute: true }),
      height: skate.prop.string({ attribute: true }),
      debug: skate.prop.boolean({ attribute: true }),

      // General.
      pixelRatio: skate.prop.number({ attribute: true }),
      screenBox: skate.prop.array<GlPlot2dComponent, number>({ attribute: true }),
      dataBox: skate.prop.array<GlPlot2dComponent, number>({ attribute: true }),
      viewBox:skate.prop.array<GlPlot2dComponent, number>({ attribute: true }),

      // Title.
      titleEnable: skate.prop.boolean({ attribute: true }),
      title: skate.prop.string({ attribute: true }),
      titleCenter: skate.prop.array<GlPlot2dComponent, number>({ attribute: true }),
      titleAngle: skate.prop.number({ attribute: true }),
      titleColor: skate.prop.array<GlPlot2dComponent, number>({ attribute: true }),
      titleFont: skate.prop.string({ attribute: true }),
      titleSize: skate.prop.number({ attribute: true }),

      // Background color.
      backgroundColor: skate.prop.array<GlPlot2dComponent, number>({ attribute: true }),

      // Border.
      borderColor: skate.prop.array<GlPlot2dComponent, number>({ attribute: true }),
      borderLineEnable: skate.prop.array<GlPlot2dComponent, boolean>({ attribute: true }),
      borderLineWidth: skate.prop.array<GlPlot2dComponent, number>({ attribute: true }),
      borderLineColor: skate.prop.array<GlPlot2dComponent, number[]>({ attribute: true }),

      // Labels.
      labels: skate.prop.array<GlPlot2dComponent, string>({ attribute: true }),
      labelEnable: skate.prop.array<GlPlot2dComponent, boolean>({ attribute: true }),
      labelAngle: skate.prop.array<GlPlot2dComponent, number>({ attribute: true }),
      labelPad: skate.prop.array<GlPlot2dComponent, number>({ attribute: true }),
      labelSize: skate.prop.array<GlPlot2dComponent, number>({ attribute: true }),
      labelFont: skate.prop.array<GlPlot2dComponent, string>({ attribute: true }),
      labelColor: skate.prop.array<GlPlot2dComponent, number[]>({ attribute: true }),

      // Ticks.
      ticks: skate.prop.array<GlPlot2dComponent, Tick[]>(),
      tickEnable: skate.prop.array<GlPlot2dComponent, boolean>({ attribute: true }),
      tickPad: skate.prop.array<GlPlot2dComponent, number>({ attribute: true }),
      tickAngle: skate.prop.array<GlPlot2dComponent, number>({ attribute: true }),
      tickColor: skate.prop.array<GlPlot2dComponent, number[]>({ attribute: true }),
      tickMarkWidth: skate.prop.array<GlPlot2dComponent, number>({ attribute: true }),
      tickMarkLength: skate.prop.array<GlPlot2dComponent, number>({ attribute: true }),
      tickMarkColor: skate.prop.array<GlPlot2dComponent, number[]>({ attribute: true }),

      // Grid lines.
      gridLineEnable: skate.prop.array<GlPlot2dComponent, boolean>({ attribute: true }),
      gridLineColor: skate.prop.array<GlPlot2dComponent, number[]>({ attribute: true }),
      gridLineWidth: skate.prop.array<GlPlot2dComponent, number>({ attribute: true }),

      // Zero lines.
      zeroLineEnable: skate.prop.array<GlPlot2dComponent, boolean>({ attribute: true }),
      zeroLineColor: skate.prop.array<GlPlot2dComponent, number[]>({ attribute: true }),
      zeroLineWidth: skate.prop.array<GlPlot2dComponent, number>({ attribute: true })
    };
  }

  /**
   * Creates an instance of GlPlot2dComponent.
   *
   * @memberOf GlPlot2dComponent
   */
  constructor() {
    super();
  }

  /**
   * Function that is called after the element has been inserted to the document.
   *
   * @memberOf GlPlot2dComponent
   */
  connectedCallback(): void {
    super.connectedCallback();
  }

  /**
   * Function that is called to render the element.
   *
   * @param {GlPlot2dComponentProps} [props]
   * @returns
   *
   * @memberOf GlPlot2dComponent
   */
  renderCallback(props?: GlPlot2dComponentProps) {
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
  renderedCallback(): void {
    if (this.shadowRoot && !this.canvas) {
      this.canvas = this.shadowRoot.querySelector('canvas');
      this.initResize();
      this.initAndDrawPlot();
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
  attributeChangedCallback(name: string, oldValue: null | string, newValue: null | string): void {
    super.attributeChangedCallback(name, oldValue, newValue);
  }

  /**
   * Function that is called after the element has been removed from the document.
   *
   * @memberOf GlPlot2dComponent
   */
  disconnectedCallback(): void {
    super.disconnectedCallback();
    this.plot.dispose();
  }

  /**
   * Helper that returns the styles for this component.
   *
   * @returns {string}
   *
   * @memberOf GlPlot2dComponent
   */
  getStyles(): string {
    const width = this['width'];
    const height = this['height'];

    const styles = `
      div {
        width: ${width};
        height: ${height};
      }
    `;

    return styles;
  }

  /**
   * Helper function that initializes resize canvas logic.
   *
   * @memberOf GlPlot2dComponent
   */
  initResize(): void {
    // Setup fit().
    let resize = fit(this.canvas, null, +window.devicePixelRatio);

    // Resize after setting up fit().
    resize();

    // Debounce the resize call.
    let debounceResize = debounce(() => {
      resize();
      this.initAndDrawPlot();
    }, 200);

    // Setup resize event listener.
    window.addEventListener('resize', debounceResize, false);
  }

  /**
   * Helper function that initializes and draws a plot.
   *
   * @returns {void}
   *
   * @memberOf GlPlot2dComponent
   */
  initAndDrawPlot(): void {
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

    const aspect = this.gl.drawingBufferWidth / this.gl.drawingBufferHeight;
    const dataBox = [-20, -20 / aspect, 20, 20 / aspect];

    this.options = {
      gl:               this.gl,

      pixelRatio:       this['pixelRatio'],
      screenBox:        this['screenBox'].length > 0 ? this['screenBox'] : null,
      dataBox:          this['dataBox'].length > 0 ? this['dataBox'] : dataBox,
      viewBox:          this['viewBox'].length > 0 ? this['viewBox'] : null,

      titleEnable:      this['titleEnable'],
      title:            this['title'],
      titleCenter:      this['titleCenter'],
      titleAngle:       this['titleAngle'],
      titleColor:       this['titleColor'],
      titleFont:        this['titleFont'],
      titleSize:        this['titleSize'],

      backgroundColor:  this['backgroundColor'],

      borderColor:      this['borderColor'],
      borderLineEnable: this['borderLineEnable'],
      borderLineWidth:  this['borderLineWidth'],
      borderLineColor:  this['borderLineColor'],

      labels:           this['labels'],
      labelEnable:      this['labelEnable'],
      labelAngle:       this['labelAngle'],
      labelPad:         this['labelPad'],
      labelSize:        this['labelSize'],
      labelFont:        this['labelFont'],
      labelColor:       this['labelColor'],

      ticks:            this['ticks'].length > 0 ? this['ticks'] : [ this.makeTicks(-20, 20, 4), this.makeTicks(-20, 20, 2)],
      tickEnable:       this['tickEnable'],
      tickPad:          this['tickPad'],
      tickAngle:        this['tickAngle'],
      tickColor:        this['tickColor'],
      tickMarkWidth:    this['tickMarkWidth'],
      tickMarkLength:   this['tickMarkLength'],
      tickMarkColor:    this['tickMarkColor'],

      gridLineEnable:   this['gridLineEnable'],
      gridLineColor:    this['gridLineColor'],
      gridLineWidth:    this['gridLineWidth'],

      zeroLineEnable:   this['zeroLineEnable'],
      zeroLineWidth:    this['zeroLineWidth'],
      zeroLineColor:    this['zeroLineColor']
    }

    this.plot = createPlot(this.options);

    this['traces'].forEach((trace: Trace) => {
      trace.positions = this.makePositions(trace.positionCount);

      if (trace.line) {
        this.addLinePlot(trace.positions, trace.line);
      }
      else if (trace.scatter) {
        this.addScatterPlot(trace.positions, trace.scatter);
      }
    });

    if (this['debug']) {
      console.time('drawTime');
    }

    this.plot.draw();

    if (this['debug']) {
      console.timeEnd('drawTime');
    }
  }

  /**
   * Helper that adds a line plot to the current plot.
   *
   * @param {Float32Array} positions
   * @param {Line} line
   *
   * @memberOf GlPlot2dComponent
   */
  addLinePlot(positions: Float32Array, line: Line): void {
    const linePlot = createLine(this.plot, {
      positions: positions,
      fill: line.fill,
      fillColor: line.fillColor,
      width: line.width
    });
  }

  /**
   * Helper that adds a scatter plot to the current plot.
   *
   * @param {Float32Array} positions
   * @param {Scatter} scatter
   *
   * @memberOf GlPlot2dComponent
   */
  addScatterPlot(positions: Float32Array, scatter: Scatter): void {
    const scatterPlot = createScatter(this.plot, {
      positions: positions,
      size: scatter.size,
      color: scatter.color,
      borderSize: scatter.borderSize,
      borderColor: scatter.borderColor
    });
  }

  /**
   * Helper function that makes dummy ticks.
   *
   * @param {number} lo
   * @param {number} hi
   * @param {number} step
   * @returns {Tick[]}
   *
   * @memberOf GlPlot2dComponent
   */
  makeTicks(lo: number, hi: number, step: number): Tick[] {
    let result: Tick[] = [];

    for (let i = lo; i <= hi; i += step) {
      result.push({x: i, text: i.toString()});
    }

    return result
  }

  /**
   * Helper function that makes dummy positions.
   *
   * @param {number} positionCount
   * @returns {Float32Array}
   *
   * @memberOf GlPlot2dComponent
   */
  makePositions(positionCount: number): Float32Array {
    let positions = new Float32Array(2 * positionCount)

    for (let i = 0; i < 2 * positionCount; i += 2) {
      positions[i]   = (i / positionCount) * 20 - 20;
      positions[i+1] = gaussRandom();
    }

    return positions;
  }
}

customElements.define('gl-plot-2d', GlPlot2dComponent);
