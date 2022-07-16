<template>
    <el-card>
        <div slot="header">
            <div class="header">
                <span>销售额类别占比</span>
                <el-radio-group v-model="tabPosition">
                    <el-radio-button label="全部渠道">全部渠道</el-radio-button>
                    <el-radio-button label="线上">线上</el-radio-button>
                    <el-radio-button label="门店">门店</el-radio-button>
                </el-radio-group>
            </div>
        </div>
        <div style="width:100%;height:400px" ref="pie"></div>
    </el-card>
</template>

<script>
import * as echarts from 'echarts'
export default {
    name: 'Category',
    data() {
        return {
            tabPosition: '全部渠道'
        }
    },
    mounted() {
        const myEcharts = echarts.init(this.$refs.pie)
        myEcharts.setOption({
            title: {
                text: '搜索引擎',
                subtext: 1048,
                left: 'center',
                top: 'center'
            },
            tooltip: {
                trigger: 'item'
            },
            series: [
                {
                    name: '销售额',
                    type: 'pie',
                    //：数组的第一项是内半径，第二项是外半径
                    radius: ['40%', '70%'],
                    //是否启用防止标签重叠策略，默认开启，在标签拥挤重叠的情况下会挪动各个标签的位置，防止标签间的重叠
                    avoidLabelOverlap: false,
                    itemStyle: {
                        //表示内圆角半径和外圆角半径都是 10px。
                        borderRadius: 10,
                        //图形的描边颜色。
                        borderColor: '#fff',
                        //描边线宽
                        borderWidth: 2
                    },
                    label: {
                        //标签显示
                        show: true,
                        //标签的位置。
                        position: 'outside'
                    },
                    //标签的视觉引导线配置
                    labelLine: {
                        show: true
                    },
                    data: [
                        { value: 1048, name: '搜索引擎' },
                        { value: 735, name: '直接访问' },
                        { value: 580, name: '邮件营销' },
                        { value: 484, name: '联盟广告' },
                        { value: 300, name: '视频广告' }
                    ]
                }
            ]
        })

        myEcharts.on('mouseover', (params) => {
            // series 的元素被 'mouseover' 时，此方法被回调。
            const { value, name } = params.data
            //重新设置标题
            myEcharts.setOption({
                title: {
                    text: name,
                    subtext: value
                }
            })
        });
    }
}
</script>

<style scoped>
.header {
    display: flex;
    justify-content: space-between;
    align-items: center;
}
</style>