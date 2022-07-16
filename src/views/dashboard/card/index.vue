<template>
    <div>
        <el-row :gutter="20">
            <el-col :span="6">
                <el-card>
                    <Detail title="总销售额" :count="'￥' + datalist.salesTotal">
                        <template slot="main">
                            <span>周同比<i v-html="'\u00a0\u00a0\u00a0\u00a0\u00a0\u00a0'"></i>{{
                                    datalist.salesGrowthLastMonth
                            }}%
                            </span>
                            <svg t="1657511931281" class="icon" viewBox="0 0 1024 1024" version="1.1"
                                xmlns="http://www.w3.org/2000/svg" p-id="3456" width="16" height="16">
                                <path
                                    d="M255.998 488.11h167.253l0.909 322.563h166.4v-322.56l167.253 0.455L506.819 165.61l-250.821 322.5z"
                                    fill="#d81e06" p-id="3457"></path>
                            </svg>
                            <i v-html="'\u00a0\u00a0\u00a0\u00a0\u00a0\u00a0'"></i>
                            <span>日同比<i v-html="'\u00a0\u00a0\u00a0\u00a0\u00a0\u00a0'"></i>{{
                                    datalist.salesGrowthLastDay
                            }}%
                            </span>
                            <svg t="1657511970323" class="icon" viewBox="0 0 1024 1024" version="1.1"
                                xmlns="http://www.w3.org/2000/svg" p-id="5200" width="16" height="16">
                                <path
                                    d="M768.002 535.89H600.749l-0.909-322.563h-166.4v322.56l-167.253-0.455L517.181 858.39l250.821-322.5z"
                                    fill="#1296db" p-id="5201"></path>
                            </svg>
                        </template>
                        <template slot="footer">
                            <span>日销售额￥ {{ datalist.salesToday }}</span>
                        </template>
                    </Detail>
                </el-card>
            </el-col>
            <el-col :span="6">
                <el-card>
                    <Detail title="访问量" :count="datalist.visitTotal">
                        <template slot="main">
                            <Charts></Charts>
                        </template>
                        <template slot="footer">
                            <span>日访问量 {{ datalist.visitToday }}</span>
                        </template>
                    </Detail>
                </el-card>
            </el-col>
            <el-col :span="6">
                <el-card>
                    <Detail title="支付笔数" :count="datalist.payTotal">
                        <template slot="main">
                            <BarCharts></BarCharts>
                        </template>
                        <template slot="footer">
                            <span>转化率 {{ datalist.payRate }}%</span>
                        </template>
                    </Detail>
                </el-card>
            </el-col>
            <el-col :span="6">
                <el-card>
                    <Detail title="运营活动效果" count="78%">
                        <template slot="main">
                            <Progress></Progress>
                        </template>
                        <template slot="footer">
                            <span>周同比<i
                                    v-html="'\u00a0\u00a0\u00a0\u00a0\u00a0\u00a0'"></i>{{ datalist.activityGrowthLastMonth }}%
                            </span>
                            <svg t="1657511931281" class="icon" viewBox="0 0 1024 1024" version="1.1"
                                xmlns="http://www.w3.org/2000/svg" p-id="3456" width="16" height="16">
                                <path
                                    d="M255.998 488.11h167.253l0.909 322.563h166.4v-322.56l167.253 0.455L506.819 165.61l-250.821 322.5z"
                                    fill="#d81e06" p-id="3457"></path>
                            </svg>
                            <i v-html="'\u00a0\u00a0\u00a0\u00a0\u00a0\u00a0'"></i>
                            <span>日同比<i
                                    v-html="'\u00a0\u00a0\u00a0\u00a0\u00a0\u00a0'"></i>{{ datalist.activityGrowthLastDay }}%
                            </span>
                            <svg t="1657511970323" class="icon" viewBox="0 0 1024 1024" version="1.1"
                                xmlns="http://www.w3.org/2000/svg" p-id="5200" width="16" height="16">
                                <path
                                    d="M768.002 535.89H600.749l-0.909-322.563h-166.4v322.56l-167.253-0.455L517.181 858.39l250.821-322.5z"
                                    fill="#1296db" p-id="5201"></path>
                            </svg>
                        </template>
                    </Detail>
                </el-card>
            </el-col>
        </el-row>
    </div>
</template>

<script>
import { mapState } from 'vuex';
import Detail from './detail/index.vue';
import Charts from './charts/index.vue';
import BarCharts from './barCharts/index.vue';
import Progress from './progress/index.vue';

export default {
    name: "Card",
    components: { Detail, Charts, BarCharts, Progress },
    computed: {
        ...mapState({ datalist: state => state.home.datalist })
    }
}
</script>

<style>
</style>