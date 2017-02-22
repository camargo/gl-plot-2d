import 'skatejs-web-components';
import * as skate from 'skatejs';

import { debounce } from 'underscore';
import * as fit from 'canvas-fit';
import * as gaussRandom from 'gauss-random';
import * as createScatter from 'gl-scatter2d';
import * as createLine from 'gl-line2d';
import * as createPlot from 'gl-plot2d';

interface Tick {
  x: number;
  text: string;
}

interface GlPlot2dProps {
  // General.
  plotType: string;
  pointCount: number;
  pointPositions: Float32Array;
  pixelRatio: number;
  screenBox: number[] | null;
  dataBox: number[] | null;
  viewBox: number[] | null;
  debug: boolean;

  // For line plots.
  lineFill: boolean[];
  lineFillColor: number[][];
  lineWidth: number;

  // For scatter plots.
  scatterSize: number;
  scatterColor: number[];
  scatterBorderSize: number;
  scatterBorderColor: number[];

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

/**
 * GlPlot2dComponent class.
 *
 * @export
 * @class GlPlot2dComponent
 * @extends {skate.Component<GlPlot2dProps>}
 */
export default class GlPlot2dComponent extends skate.Component<GlPlot2dProps> {
  private gl: WebGLRenderingContext | null; // WebGL Context.
  private canvas: HTMLCanvasElement | null; // Canvas element we render to.
  private plot: any;                        // Plot object via gl-plot2d.

  /**
   * Custom properties that should be defined on the element. These are set up in the constructor.
   *
   * @readonly
   * @static
   * @type {skate.ComponentProps<GlPlot2dComponent, GlPlot2dProps>}
   * @memberOf GlPlot2dComponent
   */
  static get props(): skate.ComponentProps<GlPlot2dComponent, GlPlot2dProps> {
    return {
      // General.
      plotType: skate.prop.string({ attribute: true }),
      pointCount: skate.prop.number({ attribute: true }),
      pointPositions: skate.prop.object<GlPlot2dComponent, Float32Array>({ attribute: true }),
      pixelRatio: skate.prop.number({ attribute: true }),
      screenBox: skate.prop.array<GlPlot2dComponent, number>({ attribute: true }),
      dataBox: skate.prop.array<GlPlot2dComponent, number>({ attribute: true }),
      viewBox:skate.prop.array<GlPlot2dComponent, number>({ attribute: true }),
      debug: skate.prop.boolean({ attribute: true }),

      // For line plots.
      lineFill: skate.prop.array<GlPlot2dComponent, boolean>({ attribute: true }),
      lineFillColor: skate.prop.array<GlPlot2dComponent, number[]>({ attribute: true }),
      lineWidth: skate.prop.number({ attribute: true }),

      // For scatter plots.
      scatterSize: skate.prop.number({ attribute: true }),
      scatterColor: skate.prop.array<GlPlot2dComponent, number>({ attribute: true }),
      scatterBorderSize: skate.prop.number({ attribute: true }),
      scatterBorderColor: skate.prop.array<GlPlot2dComponent, number>({ attribute: true }),

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
   * @param {GlPlot2dProps} [props]
   * @returns
   *
   * @memberOf GlPlot2dComponent
   */
  renderCallback(props?: GlPlot2dProps) {
    return ([
      <style>
      {`
        div {
          width: 100%;
          height: 300px
        }

        canvas {
          position: absolute;
          bottom: 0px;
          top: 0px;
          left: 0px;
          right: 0px;
        }
      `}
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
  }

  /**
   * Helper function that initializes resize canvas logic.
   *
   * @memberOf GlPlot2dComponent
   */
  initResize(): void {
    // Setup fit().
    let resize = fit(this.canvas);
    resize.scale = window.devicePixelRatio || 1;

    if (this.shadowRoot) {
      resize.parent = this.shadowRoot.querySelector('div');
    }

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

    let aspect = this.gl.drawingBufferWidth / this.gl.drawingBufferHeight;
    let dataBox = [-20, -20 / aspect, 20, 20 / aspect];

    let options = {
      gl:               this.gl,

      pixelRatio:       this['pixelRatio'],
      screenBox:        this['screenBox'].length > 0 ? this['screenBox'] : null,
      viewBox:          this['viewBox'].length > 0 ? this['viewBox'] : null,
      dataBox:          this['dataBox'].length > 0 ? this['dataBox'] : dataBox,

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

      ticks:            this['ticks'].length > 0 ? this['ticks'] : [ this.makeTicks(-20, 20), this.makeTicks(-20, 20)],
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

    this.plot = createPlot(options);

    // Line plot.
    if (this['plotType'] === 'line') {
      let line = createLine(this.plot, {
        positions: this['pointPositions'].length > 0 ? this['pointPositions'] : this.makePositions(),
        fill: this['lineFill'],
        fillColor: this['lineFillColor'],
        width: this['lineWidth']
      });

      this.plot.addObject(line);
    }
    // Scatter plot.
    else if (this['plotType'] === 'scatter') {
      let scatter = createScatter(this.plot, {
        positions: this['pointPositions'].length > 0 ? this['pointPositions'] : this.makePositions(),
        size: this['scatterSize'],
        color: this['scatterColor'],
        borderSize: this['scatterBorderSize'],
        borderColor: this['scatterBorderColor']
      });
    }

    if (this['debug']) {
      console.time('drawTime');
    }

    this.plot.draw();

    if (this['debug']) {
      console.timeEnd('drawTime');
    }
  }

  /**
   * Helper function that makes dummy ticks.
   *
   * @param {number} lo
   * @param {number} hi
   * @returns {Tick[]}
   *
   * @memberOf GlPlot2dComponent
   */
  makeTicks(lo: number, hi: number): Tick[] {
    let result: Tick[] = [];

    for (let i = lo; i <= hi; ++i) {
      result.push({x: i, text: i.toString()});
    }

    return result
  }

  /**
   * Helper function that makes dummy positions.
   *
   * @returns {Float32Array}
   *
   * @memberOf GlPlot2dComponent
   */
  makePositions(): Float32Array {
    let positions = new Float32Array(2 * this['pointCount'])

    for (let i = 0; i < 2 * this['pointCount']; i += 2) {
      positions[i]   = (i / this['pointCount']) * 20 - 20;
      positions[i+1] = gaussRandom();
    }

    return positions;
  }
}

customElements.define('gl-plot-2d', GlPlot2dComponent);
