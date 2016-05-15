import { expect as expect } from 'chai';
import d3 from 'd3';
import StackBarChart from '../../../lib/javascripts/Charts/StackBarChart';
import addChartSpec from './ChartSpec.js';

module.exports = function() {
  describe('Single Bar Chart with negative value', () => {
    let data;
    let options;
    let barChart;

    before(()=>{
      data = [
        [ {'x': new Date('2016-01'), 'y': -20, id: 0},
          {'x': new Date('2016-02'), 'y': 20, id: 0},
          {'x': new Date('2016-03'), 'y': 0, id: 0}]
      ];

      options = {
        height: 300,
        data: data,
        element: d3.select('#chart'),
        margin: {top: 0, right: 0, bottom: 0, left: 0}
      };

      barChart = new StackBarChart(options);
      barChart.init();
    });

    addChartSpec(()=>({ chart: barChart, data: data}));

    it('should have correct min value', () => {
      expect(barChart.yMin).to.be.equal(-20);
    });


    it('should have negative and positive bars', () => {
      let halfHeight = `${300/2}`;
      d3.selectAll('rect').each(function(d, i) {
        //first one is a negative bar, starts from middle position, goes to bottom
        if(i === 0 ){
          expect(d3.select(this).attr('y')).to.be.equal(halfHeight);
          expect(d3.select(this).attr('height')).to.be.equal(halfHeight);
        }
        //second one is a positive bar, starts from top, goes into middle position
        if(i === 1 ){
          expect(d3.select(this).attr('y')).to.be.equal('0');
          expect(d3.select(this).attr('height')).to.be.equal(halfHeight);
        }
        // third one is 0, starts in center, height 0
        if(i === 2 ){
          expect(d3.select(this).attr('y')).to.be.equal(halfHeight);
          expect(d3.select(this).attr('height')).to.be.equal('0');
        }
      });
    });

    after(()=>{
     barChart.destroy();
    });
  });

  describe('Multi Bar Chart with negative value', () => {
    let data;
    let options;
    let barChart;

    before(()=>{
      data = [
        [ {'x': new Date('2016-01'), 'y': -20, id: 0, index: 0},
          {'x': new Date('2016-02'), 'y': 20, id: 0, index: 0},
          {'x': new Date('2016-03'), 'y': 0, id: 0, index: 0}],
          [ {'x': new Date('2016-01'), 'y': -10, id: 0, index: 1},
          {'x': new Date('2016-02'), 'y': -10, id: 0, index: 1},
          {'x': new Date('2016-03'), 'y': 10, id: 0, index: 1}]
      ];

      options = {
        height: 300,
        data: data,
        element: d3.select('#chart'),
        margin: {top: 0, right: 0, bottom: 0, left: 0}
      };

      barChart = new StackBarChart(options);
      barChart.init();
    });

    addChartSpec(()=>({ chart: barChart, data: data}));

    it('should have correct min value', () => {
      expect(barChart.yMin).to.be.equal(-30);
    });


    it('should have negative and positive bars', () => {
      d3.selectAll('rect').each(function(d, i) {
        //first one is a negative bar, starts from middle position, goes to bottom
        if(i === 0 ){
          expect(d3.select(this).attr('y')).to.be.equal('120');
          expect(d3.select(this).attr('height')).to.be.equal('60');
        }
        //second one is a positive bar, starts from top, goes into middle position
        if(i === 1 ){
          expect(d3.select(this).attr('y')).to.be.equal('120');
          expect(d3.select(this).attr('height')).to.be.equal('60');
        }
        // third one is 0, starts in center, height 0
        if(i === 2 ){
          expect(d3.select(this).attr('y')).to.be.equal('60');
          expect(d3.select(this).attr('height')).to.be.equal('60');
        }

        if(i === 3 ){
          expect(d3.select(this).attr('y')).to.be.equal('180');
          expect(d3.select(this).attr('height')).to.be.equal('120');
        }
        //second one is a positive bar, starts from top, goes into middle position
        if(i === 4 ){
          expect(d3.select(this).attr('y')).to.be.equal('0');
          expect(d3.select(this).attr('height')).to.be.equal('120');
        }
        // third one is 0, starts in center, height 0
        if(i === 5 ){
          expect(d3.select(this).attr('y')).to.be.equal('60');
          expect(d3.select(this).attr('height')).to.be.equal('0');
        }
      });
    });

    after(()=>{
     barChart.destroy();
    });
  });
}
