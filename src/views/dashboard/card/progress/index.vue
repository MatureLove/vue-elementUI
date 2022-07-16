<template>
    <div style="width:100%;height:100%" ref="charts"></div>
</template>

<script>
import { mapState } from 'vuex'
import * as echarts from 'echarts'
export default {
    name: 'Progress',
    data() {
        return {
            myEcharts: null
        }
    },
    mounted() {
        this.myEcharts = echarts.init(this.$refs.charts)
        this.myEcharts.setOption({
            xAxis: {
                //隐藏轴
                show: false,
                //坐标刻度值最小值
                min: 0,
                //坐标刻度值最大值
                max: 100
            },
            yAxis: {
                show: false,
                //均分
                type: 'category'
            },
            //
            series: [
                {
                    //图标类型
                    type: 'bar',
                    data: [],
                    //柱状体颜色
                    color: 'yellowgreen',
                    showBackground: true,
                    //柱状图的背景颜色
                    backgroundStyle: {
                        color: '#eee'
                    },
                    //柱状图的宽度
                    barWidth: 10,
                    //文本
                    label: {
                        show: true,
                        formatter: '|',
                        position: 'right'
                    }
                }
            ],
            //提示信息
            tooltip: {},
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
                    //隐藏轴
                    show: false,
                    //坐标刻度值最小值
                    min: 0,
                    //坐标刻度值最大值
                    max: 100
                },
                yAxis: {
                    show: false,
                    //均分
                    type: 'category'
                },
                //
                series: [
                    {
                        //图标类型
                        type: 'bar',
                        data: [this.datalist.activityRate],
                        //柱状体颜色
                        color: 'yellowgreen',
                        showBackground: true,
                        //柱状图的背景颜色
                        backgroundStyle: {
                            color: '#eee'
                        },
                        //柱状图的宽度
                        barWidth: 10,
                        //文本
                        label: {
                            show: true,
                            formatter: '|',
                            position: 'right'
                        }
                    }
                ],
                //提示信息
                tooltip: {},
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