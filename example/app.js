import React, { Component } from 'react';
import { render } from 'react-dom';
import { props } from 'skatejs';

import * as glPlot2d from 'gl-plot-2d';

class App extends Component {
  constructor() {
    super();
    glPlot2d.defineGlPlot2D('gl-plot-2d');
  }

  componentWillMount() {
    document.addEventListener('gl-plot-2d-init-plot-done', () => {
      this.glPlot2dComponent.drawPlot();
    });
  }

  componentDidMount() {
    const p1 = glPlot2d.getRandomPositions(1000);
    const p2 = glPlot2d.getRandomPositions(100);

    const trace1 = {
      mode: 'line',
      positions: p1.positions,
      min: p1.min,
      max: p1.max,
      line: {
        fill: [false, false, false, false],
        fillColor: [[0, 0, 1, 0.5], [0, 0, 1, 0.5], [0, 0, 1, 0.5], [0, 0, 1, 0.5]],
        width: 1
      }
    };

    const trace2 = {
      mode: 'scatter',
      positions: p2.positions,
      min: p2.min,
      max: p2.max,
      scatter: {
        size: 10,
        color: [0.0, 0.9, 0.0, 1],
        borderSize: 1,
        borderColor: [0, 0, 0, 1]
      }
    };

    this.traces = [trace1, trace2];
    this.debug = true;
    this.height = '300px';
    this.width = '100%';

    const tickList = glPlot2d.getTicks(this.traces, 'linear', 1, true);

    this.plotOptions = {
      pixelRatio: 1,
      screenBox: null,
      dataBox: [tickList.t1[0].x - 0.25, tickList.t2[0].x - 0.25, tickList.t1[tickList.t1.length - 1].x + 0.25, tickList.t2[tickList.t2.length - 1].x + 0.25],
      viewBox: null,
      titleEnabe: false,
      title: '',
      titleCenter: [190, 280],
      titleAngle: 0,
      titleColor: [1.0, 0.3, 0.3, 1],
      titleFont: 'sans-serif',
      titleSize: 24,
      backgroundColor: [0, 0, 0, 0],
      borderColor: [1, 1, 1, 1],
      borderLineEnable: [true, true, true, true],
      borderLineWidth: [2, 2, 2, 2],
      borderLineColor: [[0, 0, 0, 1], [0, 0, 0, 1], [0, 0, 0, 1], [0, 0, 0, 1]],
      labels: ["X", "Y"],
      labelEnable: [false, false, true, true],
      labelAngle: [0, 0, 0, 4.71],
      labelPad: [0, 20, 0, 0],
      labelSize: [24, 24],
      labelFont: ["sans-serif", "sans-serif"],
      labelColor: [[0, 0, 0, 1], [0, 0, 0, 1], [0, 0, 0, 0], [0, 0, 0, 0]],
      ticks: [tickList.t1, tickList.t2],
      tickEnable: [true, true, false, false],
      tickPad: [20, 20, 0, 0],
      tickAngle: [0, 0, 0, 0],
      tickColor: [[0, 0, 0, 1], [0, 0, 0, 1], [0, 0, 0, 0], [0, 0, 0, 0]],
      tickMarkWidth: [1, 1, 1, 1],
      tickMarkLength: [4, 4, 4, 4],
      tickMarkColor: [[0, 0, 0, 1], [0, 0, 0, 1], [0, 0, 0, 0], [0, 0, 0, 0]],
      gridLineEnable: [true, true],
      gridLineColor: [[0, 0, 0, 0.5], [0, 0, 0, 0.5]],
      gridLineWidth: [0.5, 0.5],
      zeroLineEnable: [false, false],
      zeroLineWidth: [3, 3],
      zeroLineColor: [[0, 0, 0, 0.5], [0, 0, 0, 0.5]]
    }

    props(this.glPlot2dComponent, {
      traces: this.traces,
      debug: this.debug,
      height: this.height,
      width: this.width,
      plotOptions: this.plotOptions
    });
  }

  onIncreasePixelRatio() {
    this.plotOptions.pixelRatio = ++this.plotOptions.pixelRatio;
    props(this.glPlot2dComponent, { plotOptions: this.plotOptions });
  }

  onDecreasePixelRatio() {
    if (this.plotOptions.pixelRatio > 1) {
      this.plotOptions.pixelRatio = --this.plotOptions.pixelRatio;
      props(this.glPlot2dComponent, { plotOptions: this.plotOptions });
    }
  }

  render() {
    return (
      <div>
        <div>
          <gl-plot-2d
            id="glPlot2d"
            ref={(glPlot2dComponent) => { this.glPlot2dComponent = glPlot2dComponent }}
            traces={this.traces}
            debug
            height={this.height}
            width={this.width}
            plotOptions={this.plotOptions} />
        </div>
        <div>
          <button onClick={this.onIncreasePixelRatio.bind(this)}>Increase Pixel Ratio</button>
          <button onClick={this.onDecreasePixelRatio.bind(this)}>Decrease Pixel Ratio</button>
        </div>
      </div>
    );
  }
}

render(<App />, document.getElementById('app'));
