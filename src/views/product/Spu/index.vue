<template>
    <div>
        <el-card style="margin-bottom:20px">
            <CategorySelect @getCategoryId="getCategoryId" :isShow="isShow"></CategorySelect>
        </el-card>
        <el-card>
            <div v-show="scene === 0">
                <el-button type="primary" icon="el-icon-plus" style="margin-bottom:20px;" :disabled="!category3Id"
                    @click="addSpu">添加SPU
                </el-button>
                <el-table border :data="records">
                    <el-table-column label="序号" type="index" width="80" align="center"></el-table-column>
                    <el-table-column label="SPU名称" prop="spuName"></el-table-column>
                    <el-table-column label="SPU描述" prop="description"></el-table-column>
                    <el-table-column label="操作">
                        <template slot-scope="{row,$index}">
                            <HintButton title="添加sku" type="success" icon="el-icon-plus" size="mini"
                                @click="addSku(row)">
                            </HintButton>
                            <HintButton title="修改spu" type="warning" icon="el-icon-edit" size="mini"
                                @click="addOrUpdateSpu(row)">
                            </HintButton>
                            <HintButton title="查看当前spu全部sku列表" type="info" icon="el-icon-info" size="mini"
                                @click="handler(row)">
                            </HintButton>
                            <el-popconfirm confirmButtonText='确定' cancelButtonText='取消' icon="el-icon-info"
                                iconColor="red" :title="`确定删除${row.spuName}吗？`" @onConfirm="deleteSpu(row)">
                                <HintButton title=" 删除spu" type="danger" icon="el-icon-delete" size="mini"
                                    slot="reference">
                                </HintButton>
                            </el-popconfirm>

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
                <el-pagination :total="total" :current-page="page" :page-size="limit" :page-sizes="[3, 5, 10]"
                    :pager-count="7" layout="prev, pager, next,jumper,->,sizes,total" style="textAlign:center;"
                    @current-change="getSpuList" @size-change="chagePage" @prev-click="getSpuList"
                    @next-click="getSpuList">

                </el-pagination>
            </div>
            <AddSpu v-show="scene === 1" @repAdd="repAdd" ref="spu"></AddSpu>
            <AddSku v-show="scene === 2" @sku="sku" ref="sku"></AddSku>
        </el-card>
        <el-dialog :title="`${spu.spuName}的全部sku列表`" :visible.sync="dialogTableVisible" :before-close="close">
            <el-table :data="skuList" v-loading="loading" element-loading-text="拼命加载中">
                <el-table-column prop="skuName" label="名称"></el-table-column>
                <el-table-column prop="price" label="价格"></el-table-column>
                <el-table-column prop="weight" label="重量"></el-table-column>
                <el-table-column label="默认照片">
                    <template slot-scope="{row,$index}">
                        <img :src="row.skuDefaultImg" style="width:100px;height:100px">
                    </template>
                </el-table-column>
            </el-table>
        </el-dialog>
    </div>
</template>

<script>
//导入添加spu和添加sku模块
import AddSpu from './AddSpu'
import AddSku from './AddSku'
export default {
    name: 'Spu',
    components: { AddSpu, AddSku },
    data() {
        return {
            //控制三级联动可操作性
            isShow: true,
            //分别是分类的id
            category1Id: '',
            category2Id: '',
            category3Id: '',
            //当前页
            page: 1,
            //每页展示多少条数据
            limit: 3,
            //存放数据的数组
            records: [],
            //总页码
            total: 0,
            //控制
            scene: 0,//0表示数据列表显示，1表示添加spu显示，2表示添加sku显示

            //控制对话框是否显示
            dialogTableVisible: false,
            //spu信息
            spu: '',
            skuList: [], //存放sku列表

            loading: true//加载
        }
    },
    methods: {
        getCategoryId({ categoryId, save }) {
            if (save === 1) {
                this.category1Id = categoryId
                this.category2Id = ''
                this.category3Id = ''
            } else if (save === 2) {
                this.category2Id = categoryId
                this.category3Id = ''
            } else {
                this.category3Id = categoryId
                this.getSpuList()
            }
        },
        //获取spu数据
        async getSpuList(pager = 1) {
            try {
                this.page = pager
                const { page, limit, category3Id } = this
                let result = await this.$API.spu.reqProduct(page, limit, category3Id)
                // console.log(result)
                this.records = result.data.records
                this.total = result.data.total
            } catch (error) {
                console.log(error.messsage)
            }

        },
        //改变每页显示条数
        chagePage(limit) {
            this.limit = limit
            this.getSpuList()
        },
        //添加spu
        addSpu() {
            this.isShow = false
            this.scene = 1
            this.$refs.spu.addSpuInfo(this.category3Id)
        },
        //添加sku
        addSku(row) {
            this.isShow = false
            this.scene = 2
            this.$refs.sku.getDate(this.category1Id, this.category2Id, row)
        },
        //修改spu
        addOrUpdateSpu(row) {
            this.isShow = false
            this.scene = 1
            this.$refs.spu.getSpuInfo(row)

        },
        //取消的回调
        repAdd({ flag }) {
            this.isShow = true
            this.scene = 0
            if (flag === '修改') {
                this.getSpuList(this.page)
            } else {
                this.getSpuList()
            }
        },
        //sku保存的切换页面
        sku() {
            this.isShow = true
            this.scene = 0
        },
        //删除spu
        async deleteSpu(row) {
            try {
                //发送请求
                await this.$API.spu.reqDeleteSpu(row.id)
                //提示信息
                this.$message({ type: 'success', message: '删除成功' })
                //重新获取数据
                this.getSpuList(this.records > 1 ? this.page : this.page - 1)
            } catch (error) {
                this.$message.error(error.message)
            }
        },
        //弹框
        async handler(spu) {
            try {
                this.dialogTableVisible = true
                this.spu = spu
                //发送请求拿数据
                let result = await this.$API.sku.reqFindBySpuId(spu.id)
                this.skuList = result.data
                this.loading = false
            } catch (error) {
                console.log(error)
            }
        },
        //关闭前的回调
        close(done) {
            this.loading = true
            this.skuList = []
            done()
        }
    }
}
</script>

<style>
</style>