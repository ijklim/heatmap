const CANVAS = {
  margin: {
    top: 20,
    right: 100,
    bottom: 70,
    left: 100,
  },
  xLabel: 'Years',
  yLabel: 'Months',
  circleRadius: 00000000000000000000000000000000, // remove
  barColors: [
    [0, '#5e4fa2'],
    [2.7, '#3288bd'],
    [3.9, '#66c2a5'],
    [5, '#abdda4'],
    [6.1, '#e6f598'],
    [7.2, '#ffffbf'],
    [8.3, '#fee08b'],
    [9.4, '#fdae61'],
    [10.5, '#f46d43'],
    [11.6, '#d53e4f'],
    [12.7, '#9e0142'],
  ],
};

Vue.component('d3-heatmap', {
  template: `
    <div :id="id" />
  `,
  // svg cannot be property by itself, changes object type during assignment, within ddd object is fine
  data () {
    return {
      axis: {
        x: {},
        y: {},
      },
      color: {},
      ddd: {},
      id: 'd3-' + Math.round(Math.random() * 1000000)
    }
  },
  props: {
    d3Data: {
      type: Array,
      default: () => [],
    },
    graphHeight: {
      type: Number,
      default: 0,
    },
    graphWidth: {
      type: Number,
      default: 0,
    },
  },
  computed: {
    barHeight () {
      return this.chartHeight / 12;
    },
    chartHeight () {
      return this.graphHeight - CANVAS.margin.top - CANVAS.margin.bottom;
    },
    chartWidth () {
      return this.graphWidth - CANVAS.margin.right - CANVAS.margin.left;
    },
  },
  watch: {
    /**
     * Data is now available to build structure of chart, e.g. xGuide, yGuide
     */
    d3Data () {
      // X values and scaling function
      let xArray = this.d3Data.map(a => a.x);
      this.axis.x.values = d3
        .scaleLinear()
        .domain(d3.extent(xArray))
        .range([0, this.chartWidth]);
      
      // this.axis.x.scale becomes a function that converts a x value to a x position
      this.axis.x.scale = d3
        .scaleBand()
        .domain([...(new Set(xArray))])
        .paddingInner(0)
        .paddingOuter(0)
        // d3.min(xArray) is mapping to this.chartWidth
        // d3.max(xArray) + 5 (same as above) is mapping to starting of axis
        .range([0, this.chartWidth]);
      

      // Y values and scaling function
      let yArray = this.d3Data.map(a => a.y);
      this.axis.y.values = d3
        .scaleLinear()
        // Labels on axis, should be equal to or larger than dataset
        .domain(d3.extent(yArray))
        // Together with yGuide translate below, determines where to start drawing the axis
        .range([0, this.chartHeight]);
      
      // this.axis.y.scale becomes a function that converts a y value to a y position
      this.axis.y.scale = d3
        .scaleLinear()
        .domain(d3.extent(yArray))
        // Smallest value is mapping to margin-top
        .range([CANVAS.margin.top, CANVAS.margin.top + this.chartHeight - this.barHeight]);


      // Colors
      let tArray = this.d3Data.map(a => a.temperature);
      this.color.scale = d3
        .scaleLinear()
        // .scaleSequential()
        // .domain([d3.min(tArray), d3.mean(tArray), d3.max(tArray)])
        .domain(CANVAS.barColors.map(d => d[0]))
        // .interpolator(d3.interpolateRainbow)
        .range(CANVAS.barColors.map(d => d[1]));

      
      this.drawGuide();
      this.drawData();
      this.drawLegends();
      this.addListeners();
    }
  },
  methods: {
    /**
     * Standard code to create a d3 element
     * 
     * @param {Object} param0 
     */
    createD3Element ({
      data = [],
      transformX = CANVAS.margin.left + 1,
      transformY = 0,
      type = '',
    } = {}) {
      let result = this.ddd.svg
        .append('g')
        .attr('transform', `translate(${transformX}, ${transformY})`);
      if (type) {
        result = result
          .selectAll(type)
          .data(data)
          .enter()
          .append(type);
      }
      return result;
    },
    /**
     * Draw dots on chart
     */
    drawData () {
      // translate(x, y) specifies where bar begins, +1 to move right of y axis
      this.ddd.chart = this
        .createD3Element({
          data: this.d3Data.map(d => ({
            x: d.x,
            y: d.y,
            temperature: d.temperature,
          })),
          type: 'rect',
        })
        .attr('fill', d => this.color.scale(d.temperature))
        .attr('height', _ => this.barHeight)
        .attr('width', _ => this.axis.x.scale.bandwidth())
        .attr('x', d => this.axis.x.scale(d.x))
        .attr('y', d => this.axis.y.scale(d.y));
      // console.log('remove', this.d3Data.map(d => this.axis.y.scale(d.y)))
      // console.log('remove 2', this.axis.x.scale.bandwidth())
    },
    drawLegends () {
      
    },
    drawGuide () {
      // Y Guide
      // Month text on axis, cannot use standard axis as text needs to be in between ticks
      this
        .createD3Element({
          data: [...Array(12)].map((_, i) => {
            return {
              x: -10,
              y: (i + 1) * this.barHeight,
              text: moment((i + 1), 'M').format('MMMM'),
            }
          }),
          type: 'text',
        })
        .text(d => d.text)
        .attr('x', d => d.x)
        .attr('y', d => d.y)
        .attr('text-anchor', 'end')
        .style('font-size', '0.7rem');

      // Vertical line
      this
        .createD3Element()
        .append('path')
        .attr('d', d3.line()([[0, CANVAS.margin.top], [0, CANVAS.margin.top + this.chartHeight]]))
        .style('stroke', '#ccc')
        .style('stroke-width', '2')
        .style('stroke-linecap', 'round')
        
      
      let yLabel = [
        { x: -290, y: -75, text: CANVAS.yLabel, },
      ];
      this
        .createD3Element({
          data: yLabel,
          type: 'text',
        })
        .text(d => d.text)
        .attr("transform", "rotate(-90)")
        .attr('x', d => d.x)
        .attr('y', d => d.y)
        .style('font-size', '15px')
        .style('font-weight', 'bold')
        .attr('text-anchor', 'middle')
        .style('fill', '#6D4C41');
      

      // X Guide
      // transform(x, y) specifies where x axis begins, drawn from left to right
      this
        .createD3Element({
          transformX: CANVAS.margin.left,
          transformY: CANVAS.margin.top + this.chartHeight,
        })
        .call(d3
          .axisBottom(this.axis.x.values)
          .ticks(26)
          .tickFormat(d => d.toString())
        );
      
      let xLabel = [
        { x: Math.floor(this.chartWidth / 2), y: this.graphHeight - (CANVAS.margin.bottom - 40), text: CANVAS.xLabel, },
      ];
      this
        .createD3Element({
          data: xLabel,
          type: 'text',
        })
        .text(d => d.text)
        .attr('x', d => d.x)
        .attr('y', d => d.y)
        .style('font-size', '15px')
        .style('font-weight', 'bold')
        .attr('text-anchor', 'middle')
        .style('fill', '#6D4C41');
    },
    addListeners () {
      let component = this;
      this.ddd.chart
        .on('mouseover', function(data, index, circles) {
          // Approximate width of tooltip window
          let widthOfTooltip = 280;
          let tooltipX = +d3.event.pageX + ((d3.event.pageX + widthOfTooltip) > window.innerWidth ? (-widthOfTooltip) : 15);
          let tooltipY = +d3.event.pageY - 100;
          component.ddd.tooltip.html(component.d3Data[index].tooltip)
            // Top left of tooltip, relative to screen, not graph
            .style('left', `${tooltipX}px`)
            .style('top', `${tooltipY}px`)
            .style('opacity', 1);
          
          d3.select(this)
            .style('opacity', .5)
        })
        .on('mouseout', function(data) {
          component.ddd.tooltip.html('')
            .style('opacity', 0);
          
          d3.select(this)
            .transition()
            .duration(300)
            .style('opacity', 1)
        });
    }
  },
  mounted () {
    // Step #1: Select div to place d3 chart, set dimensions and color
    // Note: Code below must be in mounted(), created() does not work
    d3.select(`#${this.id}`)
      .append('svg')
        .attr('width', this.chartWidth + CANVAS.margin.right + CANVAS.margin.left)
        .attr('height', this.chartHeight + CANVAS.margin.top + CANVAS.margin.bottom);
    this.ddd.svg = d3.select(`#${this.id} svg`);
    this.ddd.tooltip = d3.select('body')
                         .append('div')
                         .attr('class', 'tooltip elevation-3')
                         .style('opacity', 0);
  },
});
