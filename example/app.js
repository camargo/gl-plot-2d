import React, { Component } from 'react';
import { render } from 'react-dom';
import { props } from 'skatejs';
import { first, last } from 'lodash';

import * as glPlot2d from 'gl-plot-2d';

class App extends Component {
  constructor() {
    super();
    glPlot2d.defineGlPlot2d('gl-plot-2d');
  }

  componentWillMount() {
    document.addEventListener('gl-plot-2d-init-plot-done-plot1', (event) => {
      this.glPlot2dComponent1.addLinePlot(this.line1);
    });

    document.addEventListener('gl-plot-2d-init-plot-done-plot2', () => {
      this.glPlot2dComponent2.addLinePlot(this.line2);
      this.glPlot2dComponent2.addScatterPlot(this.scatter1);
    });
  }

  componentDidMount() {
    this.makePlot1();
    this.makePlot2();

    window.dispatchEvent(new Event('resize'));
  }

  makePlot1() {
    this.name1 = 'plot1';
    this.debug1 = true;
    this.height1 = '200px';
    this.width1 = '100%';

    // Line.
    const p1Positions = glPlot2d.makeRandomPositions(1000, 10);
    const min = glPlot2d.getMinFromPositions(p1Positions);
    const max = glPlot2d.getMaxFromPositions(p1Positions);
    this.line1 = {
      positions: p1Positions,
      color: [0, 1, 0, 1],
      fill: [false, true, false, false],
      fillColor: [[0, 0, 1, 0.5], [0, 0, 1, 0.5], [0, 0, 1, 0.5], [0, 0, 1, 0.5]],
      width: 1
    };

    // Ticks.
    const tickList = glPlot2d.getTicks({ p1: min, p2: max }, 'linear', 1, true);

    // Options.
    this.plotOptions1 = {
      pixelRatio: 1,
      screenBox: null,
      dataBox: [
        first(tickList.t1).x,
        first(tickList.t2).x - 0.5,
        last(tickList.t1).x,
        last(tickList.t2).x + 0.5
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
      ticks: [tickList.t1, tickList.t2],
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
    const p3Positions = glPlot2d.makeRandomPositions(1000, 20);
    const min3 = glPlot2d.getMinFromPositions(p3Positions);
    const max3 = glPlot2d.getMaxFromPositions(p3Positions);
    this.line2 = {
      positions: p3Positions,
      color: [0, 0, 1, 1],
      fill: [false, true, false, false],
      fillColor: [[0, 1, 0, 0.5], [0, 1, 0, 0.5], [0, 1, 0, 0.5], [0, 1, 0, 0.5]],
      width: 2
    };

    // Scatter.
    const p4Positions = glPlot2d.makeRandomPositions(100, 20);
    const min4 = glPlot2d.getMinFromPositions(p4Positions);
    const max4 = glPlot2d.getMaxFromPositions(p4Positions);
    this.scatter1 = {
      positions: p4Positions,
      size: 10,
      color: [0.8, 0.0, 0.0, 1],
      borderSize: 1,
      borderColor: [0, 0, 0, 1]
    };

    // Ticks.
    const min = glPlot2d.getMinFromPoints([min3, min4]);
    const max = glPlot2d.getMaxFromPoints([max3, max4]);
    const tickList = glPlot2d.getTicks({ p1: min, p2: max }, 'linear', 1, false);

    // Options.
    this.plotOptions2 = {
      pixelRatio: 1,
      screenBox: null,
      dataBox: [
        first(tickList.t1).x,
        first(tickList.t2).x - 0.5,
        last(tickList.t1).x,
        last(tickList.t2).x + 0.5
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
      ticks: [tickList.t1, tickList.t2],
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
