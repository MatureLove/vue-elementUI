<template>
    <div>
        <!-- header -->
        <div class="header">
            <span style="margin-right:10px; color:#BDC3C7;">{{ title }}</span>
            <svg t="1657596783925" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg"
                p-id="2257" width="16" height="16">
                <path
                    d="M512 128a384 384 0 1 0 0 768 384 384 0 0 0 0-768z m0 707.669333a323.669333 323.669333 0 1 1 0-647.338666 323.669333 323.669333 0 0 1 0 647.338666z m-0.085333-248.106666c5.034667-12.245333 12.16-29.866667 21.333333-52.906667 9.216-23.04 16.682667-42.496 22.485333-58.368 5.802667-15.872 8.704-26.197333 8.704-30.976 0-8.106667-5.162667-12.16-15.488-12.16-11.861333 0-29.354667 6.656-52.565333 19.968-23.168 13.312-48.213333 31.402667-75.221333 54.272l13.994666 12.8 10.24-8.405333c6.272-6.016 13.824-11.690667 22.656-16.981334 8.832-5.290667 15.146667-7.936 18.944-7.936 5.290667 0 7.936 2.56 7.936 7.765334 0 1.450667-6.954667 19.626667-20.821333 54.485333-13.866667 34.858667-21.674667 54.698667-23.466667 59.434667l-27.989333 64.426666c-7.296 18.688-10.965333 32.085333-10.965333 40.192 0 5.376 2.133333 9.813333 6.442666 13.354667 4.266667 3.541333 9.216 5.290667 14.762667 5.290667 13.866667 0 33.536-7.253333 58.965333-21.674667 25.472-14.464 49.664-30.72 72.533334-48.810667l-14.677334-13.44-5.248 3.285334a72.533333 72.533333 0 0 1-5.674666 3.285333c-24.96 17.834667-42.24 26.752-51.797334 26.752-5.077333 0-7.594667-2.56-7.594666-7.765333 0-4.138667 3.797333-15.957333 11.349333-35.498667 7.552-19.498667 14.592-36.266667 21.162667-50.389333zM560.981333 298.666667c-9.258667 0-17.664 2.517333-25.173333 7.552a55.466667 55.466667 0 0 0-17.493333 18.346666c-4.266667 7.253333-6.314667 14.933333-6.314667 23.04 0 9.301333 3.456 17.706667 10.410667 25.173334a32.981333 32.981333 0 0 0 25.088 11.221333c13.013333 0 24.576-5.546667 34.688-16.554667 10.069333-11.008 15.146667-22.912 15.146666-35.669333a30.208 30.208 0 0 0-10.837333-23.552 37.376 37.376 0 0 0-25.557333-9.557333z"
                    p-id="2258" fill="#bfbfbf"></path>
            </svg>
        </div>
        <!-- main -->
        <div class="main">
            <span>{{ count }}</span>
            <span class="num">{{ num }}</span>
            <svg t="1657597568004" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg"
                p-id="4918" width="25" height="25">
                <path d="M512 405.333333L298.666667 618.666667h426.666666L512 405.333333z" fill="#d81e06" p-id="4919">
                </path>
            </svg>
            <svg t="1657597602601" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg"
                p-id="6039" width="25" height="25">
                <path d="M512 618.666667L298.666667 405.333333h426.666666L512 618.666667z" fill="#1afa29" p-id="6040">
                </path>
            </svg>
        </div>
        <!-- footer -->
        <div class="footer">
            <div style="width:100%;height:100%" ref="charts"></div>
        </div>

    </div>
</template>

<script>
import * as echarts from 'echarts'
export default {
    name: 'LineChats',
    props: ['title', 'count', 'num'],
    data() {
        return {

        }
    },
    mounted() {
        const myEcharts = echarts.init(this.$refs.charts)
        myEcharts.setOption({
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
                    data: [30, 20, 15, 30, 10, 20, 40],
                    //折线颜色设置
                    lineStyle: {
                        color: '#85C1E9'
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
                                offset: 0, color: '#85C1E9' // 0% 处的颜色
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
                bottom: 0,
                show: false,
            }
        })
    }


}
</script>

<style scoped>
.header {
    display: flex;
    align-items: center;
    padding: 10px 0;
}

.main {
    padding: 10px 0;
    font-size: 20px;
    display: flex;
    align-items: center;
}

.num {
    margin-left: 20px;
    font-size: 16px;
    color: #BDC3C7;
}

.footer {
    padding-bottom: 10px;
    height: 100px;
}
</style>