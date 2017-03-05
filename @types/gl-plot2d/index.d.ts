// Type definitions for gl-plot2d.
// Project: https://github.com/gl-vis/gl-plot2d
// Definitions by: camargo <https://github.com/camargo>

declare const glPlot2d: GLPlot2D;
export = glPlot2d;

declare global {
  interface GLPlot2D {
    _depthCounter: number;
    _drawPick: Function;
    _pickTimeout: number;
    _tickBounds: number[];
    backgroundColor: number[];
    borderColor: number[];
    borderLineColor: number[][];
    borderLineEnable: boolean[];
    borderLineWidth: number[];
    box: Boxes;
    dataBox: number[];
    dirty: boolean;
    gl: WebGLRenderingContext;
    grid: Grid;
    gridLineColor: number[][];
    gridLineEnable: boolean[];
    gridLineWidth: number[];
    labelAngle: number[];
    labelColor: number[][];
    labelEnable: boolean[];
    labelPad: number[];
    line: Lines;
    objects: any[];
    overlays: any[];
    pickBuffer: SelectBuffer;
    pickDelay: number;
    pickDirty: boolean;
    pickPixelRatio: number;
    pickRadius: number;
    pixelRatio: number;
    screenBox: number[];
    static: boolean;
    text: TextElements;
    tickAngle: number[];
    tickColor: number[][];
    tickEnable: boolean[];
    tickMarkColor: number[][];
    tickMarkLength: number[];
    tickMarkWidth: number[];
    tickPad: number[];
    titleAngle: number;
    titleCenter: number[];
    titleColor: number[];
    titleEnable: boolean;
    viewBox: number[];
    zeroLineColor: number[][];
    zeroLineEnable: boolean[];
    zeroLineWidth: number[];
    addObject(object: any): void;
    addOverlay(object: any): void;
    GLPlot2D(gl: WebGLRenderingContext, pickBuffer: any): GLPlot2D;
    dispose(): void;
    draw(): void;
    drawPick(): void;
    nextDepthValue(): number;
    pick(x: number, y: number): any;
    removeObject(object: any): void;
    removeOverlay(object: any): void;
    setDataBox(nbox: number[]): void;
    setDirty(): void;
    setOverlayDirty(): void;
    setScreenBox(nbox: number[]): void;
    setViewBox(nbox: number[]): void;
    update(options: any): void;
  }

  interface Boxes {
    plot: GLPlot2D;
    shader: any;
    vbo: any;
    bind(): void;
    Boxes(plot: GLPlot2D, vbo: any, shader: any): Boxes;
    dispose(): void;
    drawBox(loX: number, loY: number, hiX: number, hiY: number, color: number[]): void;
  }

  interface GridOptions {
    ticks: number[][];
    bounds: number[];
  }

  interface Grid {
    plot: GLPlot2D;
    shader: any;
    tickShader: any;
    ticks: number[][];
    vbo: any;
    Grid(plot: GLPlot2D, vbo: any, shader: any, tickShader: any): Grid;
    dispose(): void;
    drawTickMarks(): void;
    update(options: GridOptions): void;
  }

  interface Lines {
    plot: GLPlot2D;
    shader: any;
    vbo: any;
    bind(): void;
    Lines(plot: GLPlot2D, vbo: any, shader: any): Lines;
    dispose(): void;
    drawLine(startX: number, startY: number, endX: number, endY: number, width: number, color: number[]): void;
  }

  interface SelectBuffer {}

  interface TextElements {}
}
