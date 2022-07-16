<template>
    <div style="width:100%;height:100%" ref="charts"></div>
</template>

<script>
import { mapState } from 'vuex'
import * as echarts from 'echarts'
export default {
    name: 'barCharts',
    data() {
        return {
            //接受柱形图的初始化实例
            myEcharts: null,
        }
    },
    mounted() {
        this.myEcharts = echarts.init(this.$refs.charts)
        this.myEcharts.setOption({
            xAxis: {
                //隐藏轴
                show: false,
                //均分
                type: 'category'
            },
            yAxis: {
                show: false
            },
            //
            series: [
                {
                    //图标类型
                    type: 'bar',
                    data: [],
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
                    //均分
                    type: 'category'
                },
                yAxis: {
                    show: false
                },
                //
                series: [
                    {
                        //图标类型
                        type: 'bar',
                        data: this.datalist.payTrend,
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