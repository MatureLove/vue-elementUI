<template>
    <div style="width:100%;height:100%" ref="charts"></div>
</template>

<script>
import { mapState } from 'vuex'
import * as echarts from 'echarts'
export default {
    name: 'Charts',
    data() {
        return {
            myEcharts: null
        }
    },
    mounted() {
        this.myEcharts = echarts.init(this.$refs.charts)
        this.myEcharts.setOption({
            xAxis: {
                show: false,
                type: 'category',
                //边界间隙
                boundaryGap: false,
            },
            yAxis: {
                show: false
            },
            //
            series: [
                {
                    type: 'line',
                    data: [],
                    //折线颜色设置
                    lineStyle: {
                        color: 'magenta'
                    },
                    //拐点样式设置
                    itemStyle: {
                        opacity: 0
                    },
                    areaStyle: {
                        // 线性渐变，前四个参数分别是 x0, y0, x2, y2, 范围从 0 - 1，相当于在图形包围盒中的百分比，如果 globalCoord 为 `true`，则该四个值是绝对的像素位置
                        color: {
                            type: 'linear',
                            x: 0,
                            y: 0,
                            x2: 0,
                            y2: 1,
                            colorStops: [{
                                offset: 0, color: 'magenta' // 0% 处的颜色
                            }, {
                                offset: 1, color: 'white' // 100% 处的颜色
                            }],
                            global: false // 缺省为 false
                        },
                    },
                    //平滑曲线
                    smooth: true
                }
            ],

            //布局
            grid: {
                left: 0,
                right: 0,
                top: 0,
                bottom: 0
            }
        })
    },
    computed: {
        ...mapState({ datalist: state => state.home.datalist })
    },
    watch: {
        datalist() {
            this.myEcharts.setOption({
                xAxis: {
                    show: false,
                    type: 'category',
                    //边界间隙
                    boundaryGap: false,
                },
                yAxis: {
                    show: false
                },
                //
                series: [
                    {
                        type: 'line',
                        data: this.datalist.visitTrend,
                        //折线颜色设置
                        lineStyle: {
                            color: 'magenta'
                        },
                        //拐点样式设置
                        itemStyle: {
                            opacity: 0
                        },
                        areaStyle: {
                            // 线性渐变，前四个参数分别是 x0, y0, x2, y2, 范围从 0 - 1，相当于在图形包围盒中的百分比，如果 globalCoord 为 `true`，则该四个值是绝对的像素位置
                            color: {
                                type: 'linear',
                                x: 0,
                                y: 0,
                                x2: 0,
                                y2: 1,
                                colorStops: [{
                                    offset: 0, color: 'magenta' // 0% 处的颜色
                                }, {
                                    offset: 1, color: 'white' // 100% 处的颜色
                                }],
                                global: false // 缺省为 false
                            },
                        },
                        //平滑曲线
                        smooth: true
                    }
                ],

                //布局
                grid: {
                    left: 0,
                    right: 0,
                    top: 0,
                    bottom: 0
                }
            })
        }
    }
}
</script>

<style>
</style>