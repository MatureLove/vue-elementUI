<template>
    <el-card class="box-card">
        <div>
            <!-- v-model="activeName" @tab-click="handleClick" -->
            <el-tabs v-model="activeName">
                <el-tab-pane label="销售额" name="saler"></el-tab-pane>
                <el-tab-pane label="访问量" name="visitor"></el-tab-pane>
            </el-tabs>
            <div class="div">
                <span @click="getDay">今日</span>
                <span @click="getWeek">本周</span>
                <span @click="getMounth">本月</span>
                <span @click="getYear">本年</span>
                <el-date-picker v-model="date" type="daterange" range-separator="-" start-placeholder="开始日期"
                    end-placeholder="结束日期" value-format="yyyy-MM-dd" class="date">
                </el-date-picker>
            </div>
        </div>
        <el-row :gutter="10">
            <el-col :span="16" class="left">
                <div style="width:100%;height:100%;" ref="div"></div>
            </el-col>
            <el-col :span="8" class="right">
                <p>门店{{ title }}排名</p>
                <ul v-if="title === '访问量'">
                    <li v-for="user in datalist.userRank" :key="user.no"><i :class="{ bg: user.no <= 3 }">
                            {{ user.no }}</i><span class="one">{{ user.name }}</span><span class="two">{{ user.money
                            }}</span></li>
                </ul>
                <ul v-if="title === '销售额'">
                    <li v-for="order in datalist.orderRank" :key="order.no"><i :class="{ bg: order.no <= 3 }">
                            {{ order.no }}</i><span class="one">{{ order.name }}</span><span class="two">{{ order.money
                            }}</span></li>
                </ul>
            </el-col>
        </el-row>
    </el-card>
</template>

<script>
import { mapState } from 'vuex'
import * as echarts from 'echarts'
import dayjs from 'dayjs'
export default {
    name: 'Sale',
    data() {
        return {
            //接受tabs传的数据
            activeName: 'saler',
            //接受柱形图的初始化实例
            myEcharts: null,
            //收集日历的数据
            date: [],
        }
    },
    mounted() {
        //柱形图
        this.myEcharts = echarts.init(this.$refs.div)
        this.myEcharts.setOption({
            title: {
                text: '销售额趋势'
            },
            tooltip: {
                trigger: 'axis',
                axisPointer: {
                    type: 'shadow'
                }
            },
            grid: {
                left: '3%',
                right: '4%',
                bottom: '3%',
                containLabel: true
            },
            xAxis: [
                {
                    type: 'category',
                    data: [],
                    axisTick: {
                        alignWithLabel: true
                    }
                }
            ],
            yAxis: [
                {
                    type: 'value'
                }
            ],
            series: [
                {
                    name: 'Direct',
                    type: 'bar',
                    barWidth: '60%',
                    data: [],
                    //柱状图的宽度
                    barWidth: 30,
                    //柱状体颜色
                    color: '#99ccff'
                }
            ]
        })
    },
    computed: {
        //计算选中的时销售额还是访问量
        title() {
            return this.activeName === 'saler' ? '销售额' : '访问量'
        },
        //获取data的数据
        ...mapState({ datalist: state => state.home.datalist })
    },
    watch: {

        //重新修改柱形图的标题
        //再修改的时候，如果有新的配置型用新的配置型，没有新的配置项还用原来的配置项
        activeName() {
            this.myEcharts.setOption({
                title: {
                    text: this.title + '趋势'
                },
                xAxis: [
                    {
                        data: this.title === '销售额' ? this.datalist.orderFullYearAxis : this.datalist.userFullYearAxis,
                    }
                ],
                series: [
                    {
                        name: 'Direct',
                        type: 'bar',
                        barWidth: '60%',
                        data: this.title === '销售额' ? this.datalist.orderFullYear : this.datalist.userFullYear,
                        //柱状图的宽度
                        barWidth: 30,
                        //柱状体颜色
                        color: '#99ccff'
                    }
                ]
            })
        },
        //监视datalist，当数据有了之后立马展示
        datalist() {
            this.myEcharts.setOption({
                title: {
                    text: '销售额趋势'
                },
                tooltip: {
                    trigger: 'axis',
                    axisPointer: {
                        type: 'shadow'
                    }
                },
                grid: {
                    left: '3%',
                    right: '4%',
                    bottom: '3%',
                    containLabel: true
                },
                xAxis: [
                    {
                        type: 'category',
                        data: this.datalist.orderFullYearAxis,
                        axisTick: {
                            alignWithLabel: true
                        }
                    }
                ],
                yAxis: [
                    {
                        type: 'value'
                    }
                ],
                series: [
                    {
                        name: 'Direct',
                        type: 'bar',
                        barWidth: '60%',
                        data: this.datalist.orderFullYear,
                        //柱状图的宽度
                        barWidth: 30,
                        //柱状体颜色
                        color: '#99ccff'
                    }
                ]
            })
        }
    },
    methods: {
        //获取今日
        getDay() {
            const day = dayjs().format('YYYY-MM-DD');
            this.date = [day, day]
        },
        //获取本周
        getWeek() {
            const start = dayjs().day(1).format('YYYY-MM-DD');
            const end = dayjs().day(7).format('YYYY-MM-DD');
            this.date = [start, end]
        },
        //获取本月
        getMounth() {
            const start = dayjs().startOf('month').format('YYYY-MM-DD');
            const end = dayjs().endOf('month').format('YYYY-MM-DD');
            this.date = [start, end]
        },
        //获取本年
        getYear() {
            const start = dayjs().startOf('year').format('YYYY-MM-DD');
            const end = dayjs().endOf('year').format('YYYY-MM-DD');
            this.date = [start, end]
        }
    }
}
</script>

<style scoped>
.box-card {
    position: relative;
    margin: 20px 0;
}

.div {
    position: absolute;
    top: 10px;
    right: 20px;

}

.div span {
    display: inline-block;
    padding: 10px;

}

.div .date {
    margin-left: 20px;
}

.left {
    margin-top: 30px;
    height: 300px;
}

.right {
    margin-top: 15px;
}

.right p {
    margin-left: 30px;
}

.right ul {
    padding: 0;
    margin: 0;
    height: 300px;
    list-style: none;
}

li {
    height: 14%;
    line-height: 40px;
    /* display: flex;
    align-items: center; */
}

li i {
    float: left;
    width: 20px;
    height: 20px;
    line-height: 25px;
    text-align: center;
}

li .one {
    margin-left: 40px;
}

li .two {
    float: right;
}

li .bg {
    margin-top: 8px;
    font-style: normal;
    width: 20px;
    height: 20px;
    background-color: black;
    border-radius: 50%;
    line-height: 25px;
    text-align: center;
    color: white;
}
</style>