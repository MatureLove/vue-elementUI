<template>
    <div>
        <!-- 表格 分页器 -->
        <el-table border style="width: 100%" :data="records" v-loading="loading">
            <el-table-column label="序号" align="center" width="80" type="index"></el-table-column>
            <el-table-column label="名称" prop="skuName"></el-table-column>
            <el-table-column label="描述" prop="skuDesc"></el-table-column>
            <el-table-column label="默认图片" width="110">
                <template slot-scope="{row,$index}">
                    <img :src="row.skuDefaultImg" style="width:100px;height:100px">
                </template>
            </el-table-column>
            <el-table-column label="重量" width="80" align="center" prop="weight"></el-table-column>
            <el-table-column label="价格" width="80" align="center" prop="price"></el-table-column>
            <el-table-column label="操作">
                <template slot-scope="{row,$index}">
                    <el-button type="success" icon="el-icon-bottom" size="mini" v-if="row.isSale === 1"
                        @click="cancelSale(row)"></el-button>
                    <el-button type="success" icon="el-icon-top" size="mini" v-else @click="onSale(row)"></el-button>
                    <el-button type="primary" icon="el-icon-edit" size="mini" @click="edit"></el-button>
                    <el-button type="info" icon="el-icon-info" size="mini" @click="show(row)"></el-button>
                    <el-button type="danger" icon="el-icon-delete" size="mini"></el-button>
                </template>
            </el-table-column>
        </el-table>
        <!-- 分页器 
        total：总页数，
        current-page：当前页
        page-size：每页展示多少条数据
        page-sizes：调正每页展示数据的条数
        layout：整体布局
        pager-count 连续页码数
        current-change 当前页点击时触发回调
        size-change每页条数改变时触发
        prev-click 用户点击上一页按钮改变当前页后触发
        next-click 用户点击下一页按钮改变当前页后触发
        -->
        <el-pagination :total="total" :current-page="page" :page-size="limit" :page-sizes="[3, 5, 10]" :pager-count="7"
            layout="prev, pager, next,jumper,->,sizes,total" style="textAlign:center;" @current-change="getSpuList"
            @size-change="chagePage" @prev-click="getSpuList" @next-click="getSpuList">

        </el-pagination>

        <el-drawer :visible.sync="drawer" size="50%">
            <el-row>
                <el-col :span="5">
                    名称
                </el-col>
                <el-col :span="16">
                    {{ skuInfo.skuName }}
                </el-col>
            </el-row>
            <el-row>
                <el-col :span="5">
                    名称
                </el-col>
                <el-col :span="16">
                    {{ skuInfo.skuName }}
                </el-col>
            </el-row>
            <el-row>
                <el-col :span="5">
                    描述
                </el-col>
                <el-col :span="16">
                    {{ skuInfo.skuDesc }}
                </el-col>
            </el-row>
            <el-row>
                <el-col :span="5">
                    价格
                </el-col>
                <el-col :span="16">
                    {{ skuInfo.price }}
                </el-col>
            </el-row>
            <el-row>
                <el-col :span="5">
                    平台属性
                </el-col>
                <el-col :span="16">
                    <template>
                        <el-tag type="success" v-for="(attr, index) in skuInfo.skuAttrValueList" :key="attr.id"
                            style="margin:0 10px">
                            {{ attr.skuId }}--{{ attr.valueId }}</el-tag>
                    </template>
                </el-col>
            </el-row>
            <el-row>
                <el-col :span="5">
                    商品图片
                </el-col>
                <el-col :span="16">
                    <template>
                        <el-carousel trigger="click" height="350px">
                            <el-carousel-item v-for="item in skuInfo.skuImageList" :key="item.id">
                                <img :src="item.imgUrl" alt="" style="width:100%;height:350px">
                            </el-carousel-item>
                        </el-carousel>
                    </template>
                </el-col>
            </el-row>
        </el-drawer>
    </div>
</template>

<script>
//按需引入lodash 防抖
import { tryStatement } from "@babel/types";
import debounce from "lodash/debounce";
export default {
    name: 'Sku',
    data() {
        return {
            loading: true,//加载效果
            page: 1,//当前页
            limit: 10,//每页展示多少条数据
            total: 0,//总共多少条数据
            records: [],//数据列表
            drawer: false,//抽屉是否显示
            skuInfo: {},//存储请求到的数据
        }
    },
    mounted() {
        this.getSpuList()
    },
    methods: {
        chagePage(limit) {
            this.limit = limit
            this.getSpuList()
        },
        async getSpuList(pager = 1) {
            try {
                this.page = pager
                const { page, limit } = this
                let result = await this.$API.sku.reqList(page, limit)
                this.records = result.data.records
                this.total = result.data.total
                this.loading = false
            } catch (error) {
                console.log(error)
            }
        },
        //下架请求 防抖
        cancelSale: debounce(async function (row) {
            try {
                await this.$API.sku.reqCancelSale(row.id)
                row.isSale = 0
                this.$message({ type: 'success', message: '下架成功' })
            } catch (error) {
                console.log(error)
            }
        }, 1000),
        //上架 防抖
        onSale: debounce(async function (row) {
            try {
                await this.$API.sku.reqOnSale(row.id)
                row.isSale = 1
                this.$message({ type: 'success', message: '上架成功' })
            } catch (error) {
                console.log(error)
            }
        }, 1000),
        //编辑按钮
        edit() {
            this.$message({ type: 'info', message: '正在开发中......' })
        },
        //抽屉效果
        async show(sku) {
            try {
                this.drawer = true
                let result = await this.$API.sku.reqGetSkuById(sku.id)
                this.skuInfo = result.data
            } catch (error) {
                console.log(error)
            }
        }
    }
}
</script>

<style>
.el-carousel__item h3 {
    color: #475669;
    font-size: 14px;
    opacity: 0.75;
    line-height: 150px;
    margin: 0;
}

.el-carousel__item:nth-child(2n) {
    background-color: #99a9bf;
}

.el-carousel__item:nth-child(2n+1) {
    background-color: #d3dce6;
}

.el-carousel__button {
    width: 10px;
    height: 10px;
    background-color: red;
    border-radius: 50%;
}
</style>
<style scoped>
.el-col {
    margin: 20px 20px;
    height: 30px;
}

.el-col-5 {
    text-align: right;
    font-size: 25px;
    font-weight: 600;
}

.el-col-16 {
    font-size: 18px;
    padding-top: 5px;
}
</style>