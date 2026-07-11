// ECharts 按需註冊插件
import { use } from 'echarts/core'
import { CanvasRenderer } from 'echarts/renderers'
import { BarChart, LineChart, PieChart, RadarChart } from 'echarts/charts'
import {
  GridComponent,
  TooltipComponent,
  LegendComponent,
  TitleComponent,
  RadarComponent,
  PolarComponent,
} from 'echarts/components'
import { LabelLayout, UniversalTransition } from 'echarts/features'

use([
  CanvasRenderer,
  BarChart,
  LineChart,
  PieChart,
  RadarChart,
  GridComponent,
  TooltipComponent,
  LegendComponent,
  TitleComponent,
  LabelLayout,
  UniversalTransition,
  RadarComponent,
  PolarComponent,
])

export default defineNuxtPlugin(() => {})