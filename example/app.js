import React, { Component } from 'react';
import { render } from 'react-dom';

import { getTicks } from 'gl-plot-2d';

import { makePositions } from './utils';

class App extends Component {

  componentWillMount() {
    const p1 = makePositions(1000);
    const p2 = makePositions(100);

    const trace1 = {
      mode: 'line',
      positions: p1.positions,
      min: { x: p1.minX, y: p1.minY },
      max: { x: p1.maxX, y: p1.maxY },
      line: {
        fill: [false, true, false, false],
        fillColor: [[0, 0, 1, 0.5], [0, 0, 1, 0.5], [0, 0, 1, 0.5], [0, 0, 1, 0.5]],
        width: 1
      }
    };

    const trace2 = {
      mode: 'scatter',
      positions: p2.positions,
      min: { x: p2.minX, y: p2.minY },
      max: { x: p2.maxX, y: p2.maxY },
      scatter: {
        size: 10,
        color: [0.0, 0.9, 0.0, 1],
        borderSize: 1,
        borderColor: [0, 0, 0, 1]
      }
    };

    this.traces = [trace1, trace2];

    let tickList = getTicks(this.traces, 'log', 2, false);
    this.ticks = [tickList.t1, tickList.t2];

    this.dataBox = [tickList.t1[0].x - 0.25, tickList.t2[0].x - 0.25, tickList.t1[tickList.t1.length - 1].x + 0.25, tickList.t2[tickList.t2.length - 1].x + 0.25];
  }

  render() {
    return (
      <gl-plot-2d
        id="glPlot2d"
        width="100%"
        height="300px"
        traces={JSON.stringify(this.traces)}
        debug

        pixel-ratio='1'
        screen-box='[]'
        data-box={JSON.stringify(this.dataBox)}
        view-box='[]'

        title='1000 Points'
        title-center='[190, 280]'
        title-angle='0'
        title-color='[1.0, 0.3, 0.3, 1]'
        title-font='sans-serif'
        title-size='24'

        background-color='[0, 0, 0, 0]'

        border-color='[1, 1, 1, 1]'
        border-line-enable='[true, true, true, true]'
        border-line-width='[2, 2, 2, 2]'
        border-line-color='[[0, 0, 0, 1], [0, 0, 0, 1], [0, 0, 0, 1], [0, 0, 0, 1]]'

        labels='["X", "Y"]'
        label-enable='[false, false, true, true]'
        label-angle='[0, 0, 0, 4.71]'
        label-pad='[0, 20, 0, 0]'
        label-size='[24, 24]'
        label-font='["sans-serif", "sans-serif"]'
        label-color='[[0, 0, 0, 1], [0, 0, 0, 1], [0, 0, 0, 0], [0, 0, 0, 0]]'

        ticks={JSON.stringify(this.ticks)}
        tick-enable='[true, true, false, false]'
        tick-pad='[20, 20, 0, 0]'
        tick-angle='[0, 0, 0, 0]'
        tick-color='[[0, 0, 0, 1], [0, 0, 0, 1], [0, 0, 0, 0], [0, 0, 0, 0]]'
        tick-mark-width='[1, 1, 1, 1]'
        tick-mark-length='[4, 4, 4, 4]'
        tick-mark-color='[[0, 0, 0, 1], [0, 0, 0, 1], [0, 0, 0, 0], [0, 0, 0, 0]]'

        grid-line-enable='[true, true]'
        grid-line-color='[[0, 0, 0, 0.5], [0, 0, 0, 0.5]]'
        grid-line-width='[0.5, 0.5]'

        zero-line-enable='[false, false]'
        zero-line-width='[3, 3]'
        zero-line-color='[[0, 0, 0, 0.5], [0, 0, 0, 0.5]]' />
    );
  }
}

render(<App />, document.getElementById('app'));
