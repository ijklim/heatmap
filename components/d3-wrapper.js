const WRAPPER = {
  width: 1100,
  height: 700,
  headerHeight: 100,
  background: 'rgba(255, 255, 255, .95)',
}

Vue.component('d3-wrapper', {
  template: `
    <div
      class="elevation-5"
      :style="wrapperStyles"
    >
      <div :style="wrapperHeader">
        {{ appName }}<br>
        <div style="font-size:0.7em;">
          {{ yearStart }} - {{ yearEnd }}
        </div>
        <div style="font-size:0.4em; line-height:1.1em;">
          Temperatures are in Celsius and reported as anomalies relative to the Jan 1951-Dec 1980 average.<br>
          Estimated Jan 1951-Dec 1980 absolute temperature ℃: 8.66 +/- 0.07
        </div>
      </div>

      <d3-heatmap
        :app-name="appName"
        :d3-data="d3Data"
        :graph-width="graphWidth"
        :graph-height="graphHeight"
      />
    </div>
  `,
  data () {
    return {
      graphWidth: WRAPPER.width,
      graphHeight: WRAPPER.height - WRAPPER.headerHeight,
    }
  },
  props: {
    appName: {
      type: String,
      default: ''
    },
    d3Data: {
      type: Array,
      default: () => [],
    },
  },
  computed: {
    yearStart () {
      return d3.min(this.d3Data.map(d => d.x));
    },
    yearEnd () {
      return d3.max(this.d3Data.map(d => d.x));
    },
    wrapperStyles () {
      return `` +
        `height:${WRAPPER.height}px;` +
        `width:${WRAPPER.width}px;` +
        `margin:auto;` +
        `background:${WRAPPER.background};` +
        ``;
    },
    wrapperHeader () {
      return `` +
        `height:${WRAPPER.headerHeight}px;` +
        `width:100%;` +
        `text-align:center;` +
        `font-size:2.2rem;` +
        `padding-top:25px;` +
        ``;
    },
  },
});