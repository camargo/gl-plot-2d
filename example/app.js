import React, { Component } from 'react';
import { render } from 'react-dom';
import { props } from 'skatejs';
import { first, last } from 'lodash';

import {
  defineGlPlot2d,
  makeRandomPositions,
  getAxesTicks,
  getMinFromPositions,
  getMaxFromPositions,
  getMinFromPoints,
  getMaxFromPoints,
} from 'gl-plot-2d';

class App extends Component {
  constructor() {
    super();
    defineGlPlot2d();
  }

  componentWillMount() {
    document.addEventListener('gl-plot-2d-init-plot-done-plot1', (event) => {
      this.glPlot2dComponent1.addLinePlot(this.line1);
      this.glPlot2dComponent1.drawPlot();
    });

    document.addEventListener('gl-plot-2d-init-plot-done-plot2', () => {
      this.glPlot2dComponent2.addLinePlot(this.line2);
      this.glPlot2dComponent2.addScatterPlot(this.scatter1);
      this.glPlot2dComponent2.drawPlot();
    });
  }

  componentDidMount() {
    this.makePlot1();
    this.makePlot2();

    // Might need to dispatch a resize if scroll-bar present in some browsers.
    // window.dispatchEvent(new Event('resize'));
  }

  makePlot1() {
    this.name1 = 'plot1';
    this.debug1 = true;
    this.height1 = '200px';
    this.width1 = '100%';

    // Line.
    const p1Positions = makeRandomPositions(1000, 20);
    const min = getMinFromPositions(p1Positions);
    const max = getMaxFromPositions(p1Positions);
    this.line1 = {
      positions: p1Positions,
      color: [0, 0, 1, 1],
      fill: [false, true, false, true],
      fillColor: [[0, 0, 1, 0.5], [0, 0, 1, 0.5], [0, 0, 1, 0.5], [1, 0.5, 0, 0.5]],
      width: 2
    };

    // Axes Ticks.
    const axes = getAxesTicks('linear', min, max, 1, true);

    // Options.
    this.plotOptions1 = {
      pixelRatio: 1,
      screenBox: null,
      dataBox: [
        first(axes.x).tick(),
        first(axes.y).tick() - 0.5,
        last(axes.x).tick(),
        last(axes.y).tick() + 0.5
      ],
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
      ticks: [axes.x, axes.y],
      tickEnable: [false, true, false, false],
      tickPad: [20, 20, 0, 0],
      tickAngle: [0, 0, 0, 0],
      tickColor: [[0, 0, 0, 1], [0, 0, 0, 1], [0, 0, 0, 0], [0, 0, 0, 0]],
      tickMarkWidth: [1, 1, 1, 1],
      tickMarkLength: [4, 4, 4, 4],
      tickMarkColor: [[0, 0, 0, 0], [0, 0, 0, 1], [0, 0, 0, 0], [0, 0, 0, 0]],
      gridLineEnable: [false, true],
      gridLineColor: [[0, 0, 0, 0.5], [0, 0, 0, 0.5]],
      gridLineWidth: [0.5, 0.5],
      zeroLineEnable: [false, false],
      zeroLineWidth: [3, 3],
      zeroLineColor: [[0, 0, 0, 0.5], [0, 0, 0, 0.5]]
    }

    // Set props.
    props(this.glPlot2dComponent1, {
      name: this.name1,
      debug: this.debug1,
      height: this.height1,
      width: this.width1,
      plotOptions: this.plotOptions1
    });
  }

  makePlot2() {
    this.name2 = 'plot2';
    this.debug2 = true;
    this.height2 = '200px';
    this.width2 = '100%';

    // Line.
    const p3Positions = makeRandomPositions(1000, 20);
    const min3 = getMinFromPositions(p3Positions);
    const max3 = getMaxFromPositions(p3Positions);
    this.line2 = {
      positions: p3Positions,
      color: [0, 0, 1, 1],
      fill: [false, true, false, false],
      fillColor: [[0, 1, 0, 0.5], [0, 1, 0, 0.5], [0, 1, 0, 0.5], [0, 1, 0, 0.5]],
      width: 2
    };

    // Scatter.
    const p4Positions = makeRandomPositions(100, 20);
    const min4 = getMinFromPositions(p4Positions);
    const max4 = getMaxFromPositions(p4Positions);
    this.scatter1 = {
      positions: p4Positions,
      size: 10,
      color: [0.8, 0.0, 0.0, 1],
      borderSize: 1,
      borderColor: [0, 0, 0, 1]
    };

    // Axes Ticks.
    const min = getMinFromPoints([min3, min4]);
    const max = getMaxFromPoints([max3, max4]);
    const axes = getAxesTicks('linear', min, max, 1, false);


    // Options.
    this.plotOptions2 = {
      pixelRatio: 1,
      screenBox: null,
      dataBox: [
        first(axes.x).tick(),
        first(axes.y).tick() - 0.5,
        last(axes.x).tick(),
        last(axes.y).tick() + 0.5
      ],
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
      ticks: [axes.x, axes.y],
      tickEnable: [false, true, false, false],
      tickPad: [20, 20, 0, 0],
      tickAngle: [0, 0, 0, 0],
      tickColor: [[0, 0, 0, 1], [0, 0, 0, 1], [0, 0, 0, 0], [0, 0, 0, 0]],
      tickMarkWidth: [1, 1, 1, 1],
      tickMarkLength: [4, 4, 4, 4],
      tickMarkColor: [[0, 0, 0, 0], [0, 0, 0, 1], [0, 0, 0, 0], [0, 0, 0, 0]],
      gridLineEnable: [false, true],
      gridLineColor: [[0, 0, 0, 0.5], [0, 0, 0, 0.5]],
      gridLineWidth: [0.5, 0.5],
      zeroLineEnable: [false, false],
      zeroLineWidth: [3, 3],
      zeroLineColor: [[0, 0, 0, 0.5], [0, 0, 0, 0.5]]
    }

    // Set props.
    props(this.glPlot2dComponent2, {
      name: this.name2,
      debug: this.debug2,
      height: this.height2,
      width: this.width2,
      plotOptions: this.plotOptions2
    });
  }

  render() {
    const outerContainer = {
      width: '100%'
    };

    const innerContainer = {
      paddingBottom: '0.5px'
    };

    return (
      <div style={outerContainer}>
        <div style={innerContainer}>
          <gl-plot-2d ref={(glPlot2dComponent1) => { this.glPlot2dComponent1 = glPlot2dComponent1 }}/>
        </div>
        <div style={innerContainer}>
          <gl-plot-2d ref={(glPlot2dComponent2) => { this.glPlot2dComponent2 = glPlot2dComponent2 }} />
        </div>
      </div>
    );
  }
}

render(<App />, document.getElementById('app'));
