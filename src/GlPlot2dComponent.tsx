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
         Tick,
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
  private plot: any;                          // Plot object via gl-plot2d.
  private options: GlPlot2dOptions;           // Plot options for gl-plot2d.

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

      // General.
      pixelRatio: skate.prop.number({ attribute: true }),
      screenBox: skate.prop.array<GlPlot2dComponent, number>({ attribute: true }),
      dataBox: skate.prop.array<GlPlot2dComponent, number>({ attribute: true }),
      viewBox: skate.prop.array<GlPlot2dComponent, number>({ attribute: true }),

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
      ticks: skate.prop.array<GlPlot2dComponent, Tick[]>({ attribute: true }),
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
  public attributeChangedCallback(name: string, oldValue: null | string, newValue: null | string): void {
    super.attributeChangedCallback(name, oldValue, newValue);
  }

  /**
   * Function that is called after the element has been removed from the document.
   *
   * @memberOf GlPlot2dComponent
   */
  public disconnectedCallback(): void {
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
  public getStyles(): string {
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
  public initResize(): void {
    // Setup fit().
    const resize = fit(this.canvas, null, +window.devicePixelRatio);

    // Resize after setting up fit().
    resize();

    // Debounce the resize call.
    const debounceResize = debounce(() => {
      resize();
      this.plot.update(this.options);
      this.plot.draw();
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
  public initAndDrawPlot(): void {
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

    this.options = {
      gl:               this.gl,

      pixelRatio:       this['pixelRatio'],
      screenBox:        this['screenBox'].length > 0 ? this['screenBox'] : null,
      dataBox:          this['dataBox'].length > 0 ? this['dataBox'] : null,
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

      ticks:            this['ticks'],
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
    };

    this.plot = createPlot(this.options);

    this['traces'].forEach((trace: Trace) => {
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
   * @param {number[]} positions
   * @param {Line} line
   *
   * @memberOf GlPlot2dComponent
   */
  public addLinePlot(positions: number[], line: Line): void {
    createLine(this.plot, {
      positions: new Float32Array(positions),
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

customElements.define('gl-plot-2d', GlPlot2dComponent);
