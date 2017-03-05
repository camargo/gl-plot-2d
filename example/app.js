import React, { Component } from 'react';
import { render } from 'react-dom';
import { props } from 'skatejs';

import * as glPlot2d from 'gl-plot-2d';

class App extends Component {
  constructor() {
    super();
    glPlot2d.defineGlPlot2d('gl-plot-2d');
  }

  makePlot1() {
    const p1Positions = glPlot2d.getRandomPositions(100, 20);

    const trace1 = {
      mode: 'line',
      min: glPlot2d.getMax(p1Positions),
      max: glPlot2d.getMin(p1Positions),
      line: {
        positions: p1Positions,
        color: [0, 0, 1, 1],
        fill: [false, false, false, false],
        fillColor: [[0, 0, 1, 0.5], [0, 0, 1, 0.5], [0, 0, 1, 0.5], [0, 0, 1, 0.5]],
        width: 1
      }
    };

    const trace2 = {
      mode: 'scatterFancy',
      min: { x: 0.5, y: 0.5 },
      max: { x: 9.5, y: 3.5 },
      scatterFancy: {
        positions: [
          .5,.5, 1.5,.5, 2.5,.5, 3.5,.5, 4.5,.5, 5.5,.5, 6.5,.5, 7.5,.5, 8.5,.5, 9.5,.5,
          .5,1.5, 1.5,1.5, 2.5,1.5, .5,2.5, 1.5,2.5, 2.5,2.5, .5,3.5, 1.5,3.5, 2.5,3.5,
          3.5,3.5, 4.5,3.5, 5.5,3.5
        ],
        sizes: [
          40, 20, 30, 40, 50, 60, 70, 80, 90, 100,
          25, 30, 35, 40, 45, 50, 1, 5, 20, 50, 120, 150
        ],
        colors: [
          1,0,0,1, .1,0,0,1, .2,0,0,1, .3,0,0,1, .4,0,0,1, .5,0,0,1, .6,0,0,1, .7,0,0,1, .8,0,0,1, .9,0,0,1,
          1,0,0,1, 0,1,0,1, 0,0,1,1, 0,0,0,.2, 0,0,0,.5, 0,0,0,.8, 0,0,1,1, 0,0,1,1, 0,0,1,1, 0,0,1,1, 0,0,1,1,
          0,0,1,1
        ],
        glyphs: [
          '0', '1', '2', '3', '4', '5', '6', '7', '8', '9',
          '•', '+', '#', 'E', '=', 'mc²', '●', '●', '●', '●', '●', '●'
        ],
        borderWidths: [
          1,1,1,1,1,1,1,1,1,1,
          2,2,2, 0,0,0, .5, .5, .5, .5, .5, .5
        ],
        borderColors: [
          0,0,0,0, 0,0,1,.9, 0,0,1,.8, 0,0,1,.7, 0,0,1,.6, 0,0,1,.5, 0,0,1,.4, 0,0,1,.3, 0,0,1,.2, 0,0,1,.1,
          0,1,0,1, 0,0,1,1, 1,0,0,1, 0,0,0,1, 0,0,0,1, 0,0,0,1,
          0,0,0,1, 0,0,0,1, 0,0,0,1, 0,0,0,1, 0,0,0,1, 0,0,0,1
        ],
        selected: [
          false, false, false, false, false, false, false, false, false, false,
          false, false, false, false, false, false, false, false, false, false,
          false, false
        ]
      }
    };

    this.name1 = 'plot1';
    this.traces1 = [trace2];
    this.debug1 = true;
    this.height1 = '200px';
    this.width1 = '100%';

    const tickList = glPlot2d.getTicks(this.traces1, 'linear', 1, true, null);

    this.plotOptions1 = {
      pixelRatio: 1,
      screenBox: null,
      dataBox: [tickList.t1[0].x - 0.25, tickList.t2[0].x - 0.5, tickList.t1[tickList.t1.length - 1].x + 0.25, tickList.t2[tickList.t2.length - 1].x + 0.5],
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

    props(this.glPlot2dComponent1, {
      name: this.name1,
      traces: this.traces1,
      debug: this.debug1,
      height: this.height1,
      width: this.width1,
      plotOptions: this.plotOptions1
    });
  }

  makePlot2() {
    const p3Positions = glPlot2d.getRandomPositions(100, 20);
    const p4Positions = glPlot2d.getRandomPositions(1000, 30);

    const trace3 = {
      mode: 'line',
      min: glPlot2d.getMin(p3Positions),
      max: glPlot2d.getMax(p3Positions),
      line: {
        positions: p3Positions,
        color: [0, 1, 0, 1],
        fill: [false, false, false, false],
        fillColor: [[0, 1, 0, 0.5], [0, 1, 0, 0.5], [0, 1, 0, 0.5], [0, 1, 0, 0.5]],
        width: 5
      }
    };

    const trace4 = {
      mode: 'scatter',
      min: glPlot2d.getMin(p4Positions),
      max: glPlot2d.getMax(p4Positions),
      scatter: {
        positions: p4Positions,
        size: 10,
        color: [0.8, 0.0, 0.0, 1],
        borderSize: 1,
        borderColor: [0, 0, 0, 1]
      }
    };

    this.name2 = 'plot2';
    this.traces2 = [trace3, trace4];
    this.debug2 = true;
    this.height2 = '200px';
    this.width2 = '100%';

    const tickList = glPlot2d.getTicks(this.traces2, 'log', 1, false, null);

    this.plotOptions2 = {
      pixelRatio: 1,
      screenBox: null,
      dataBox: [tickList.t1[0].x - 0.25, tickList.t2[0].x - 0.5, tickList.t1[tickList.t1.length - 1].x + 0.25, tickList.t2[tickList.t2.length - 1].x + 0.5],
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

    props(this.glPlot2dComponent2, {
      name: this.name2,
      traces: this.traces2,
      debug: this.debug2,
      height: this.height2,
      width: this.width2,
      plotOptions: this.plotOptions2
    });
  }

  componentDidMount() {
    this.makePlot1();
    this.makePlot2();
    window.dispatchEvent(new Event('resize'));
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
