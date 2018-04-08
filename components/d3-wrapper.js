const WRAPPER = {
  width: 1100,
  height: 700,
  headerHeight: 70,
  background: 'rgba(255, 255, 255, .7)',
}

Vue.component('d3-wrapper', {
  template: `
    <div
      class="elevation-5"
      :style="wrapperStyles"
    >
      <div :style="wrapperHeader">
        {{ appName }}
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
        `font-size:2.5rem;` +
        `padding-top:25px;` +
        ``;
    },
  },
  methods: {
    
  },
  mounted () {
    
  }
});