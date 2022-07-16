<template>
    <div>
        <el-form label-width="80px" ref="form" :model="skuInfo">
            <el-form-item label="SPU名称">{{ spuName }}</el-form-item>
            <el-form-item label="SKU名称">
                <el-input placeholder="SKU名称" v-model="skuInfo.skuName"></el-input>
            </el-form-item>
            <el-form-item label="价格(元)">
                <el-input placeholder="价格(元)" v-model="skuInfo.price" type="number"></el-input>
            </el-form-item>
            <el-form-item label="重量(千克)">
                <el-input placeholder="重量(千克)" v-model="skuInfo.weight"></el-input>
            </el-form-item>
            <el-form-item label="规格描述">
                <el-input type="textarea" placeholder="规格描述" rows="4" v-model="skuInfo.skuDesc"></el-input>
            </el-form-item>
            <el-form-item label="平台属性">
                <el-form :inline="true" label-width="100px">
                    <el-form-item :label="attr.attrName" v-for="(attr, index) in attrInfoList" :key="attr.id">
                        <el-select placeholder="请选择" v-model="attr.attrValueInfo">
                            <el-option :label="attrValue.valueName" :value="`${attrValue.attrId}:${attrValue.id}`"
                                v-for="(attrValue, index)  in attr.attrValueList" :key="attrValue.id"></el-option>
                        </el-select>
                    </el-form-item>
                </el-form>
            </el-form-item>
            <el-form-item label="销售属性">
                <el-form :inline="true" label-width="100px">
                    <el-form-item :label="spuSaleAttr.saleAttrName" v-for="(spuSaleAttr, index) in spuSaleAttrList"
                        :key="spuSaleAttr.id">
                        <el-select placeholder="请选择" v-model="spuSaleAttr.spuSaleAttrInfo">
                            <el-option :label="spuSaleAttrValue.saleAttrValueName"
                                :value="`${spuSaleAttr.id}:${spuSaleAttrValue.id}`"
                                v-for="(spuSaleAttrValue, index) in spuSaleAttr.spuSaleAttrValueList"
                                :key="spuSaleAttrValue.id"></el-option>
                        </el-select>
                    </el-form-item>
                </el-form>
            </el-form-item>
            <el-form-item label="图片列表">
                <!--   @selection-change="handleSelectionChange" 当选择项发生变化时会触发该事件 -->
                <el-table border style="width: 100%" :data="spuImageList" @selection-change="handleSelectionChange">
                    <el-table-column width="80" align="center" type="selection"></el-table-column>
                    <el-table-column label="图片" align="center">
                        <template slot-scope="{row,$index}">
                            <img :src="row.imgUrl" width="100px" height="100px">
                        </template>
                    </el-table-column>
                    <el-table-column label="名称" prop="imgName"></el-table-column>
                    <el-table-column label="操作">
                        <template slot-scope="{row,$index}">
                            <el-button type="primary" v-if="row.isDefault === 0" @click="changeDefault(row)">设为默认
                            </el-button>
                            <el-button v-else>默认</el-button>
                        </template>
                    </el-table-column>
                </el-table>
            </el-form-item>
            <el-form-item>
                <el-button type="primary" @click="saveSkuInfo">保存</el-button>
                <el-button @click="cancel">取消</el-button>
            </el-form-item>
        </el-form>
    </div>
</template>

<script>
export default {
    name: 'AddSku',
    data() {
        return {
            imageList: [],//收集图片数据
            spuImageList: [],//获取图片数据
            spuSaleAttrList: [],//获取销售属性值
            attrInfoList: [],//获取平台属性值
            skuInfo: {
                //三级id
                category3Id: 0,
                //spuid
                spuId: 0,
                //品牌id
                tmId: 0,
                //sku名字
                skuName: "",
                //价格
                price: 0,
                //重量千克
                weight: "",
                //规格描述
                skuDesc: "",
                //默认图片
                skuDefaultImg: "",
                //平台属性
                skuAttrValueList: [
                    // {
                    //     attrId: 0,
                    //     valueId: 0,
                    // }
                ],
                //图片列表
                skuImageList: [
                    {
                        imgName: "string",
                        imgUrl: "string",
                        isDefault: "string",
                        spuImgId: 0
                    }
                ],
                //销售属性
                skuSaleAttrValueList: [
                    // {
                    //     saleAttrId: 0,
                    //     saleAttrValueId: 0,
                    // }
                ],
            },
            spuName: ''
        }
    },
    methods: {
        //发送请求获取数据
        async getDate(category1Id, category2Id, spu) {
            // console.log(category1Id, category2Id, spu)
            try {
                //收集三级列表id，spuid，spu品牌id
                this.skuInfo.category3Id = spu.category3Id
                this.skuInfo.spuId = spu.id
                this.skuInfo.tmId = spu.tmId
                //spu名称
                this.spuName = spu.spuName
                //获取图片数据
                let result = await this.$API.sku.reqSpuImageList(spu.id)
                let list = result.data
                list.forEach(item => {
                    item.isDefault = 0
                })
                this.spuImageList = list
                //获取销售属性数据
                let result1 = await this.$API.sku.reqSpuSaleAttrList(spu.id)
                this.spuSaleAttrList = result1.data
                //获取平台属性数据
                let result2 = await this.$API.sku.reqAttrInfoList(category1Id, category2Id, spu.category3Id)
                this.attrInfoList = result2.data
            } catch (error) {
                console.log(error)
            }
        },
        // 收集图片数据  @selection-change="handleSelectionChange" 当选择项发生变化时会触发该事件
        handleSelectionChange(selection) {
            //selection选中的数据组成的数组，
            this.imageList = selection
        },
        //修改默认值
        changeDefault(row) {
            // console.log(row)
            //利用排他思想先将所有的设为不是默认值
            this.spuImageList.forEach(item => {
                item.isDefault = 0
            })
            //再将当前的设置为默认值
            row.isDefault = 1
            //收集默认图片数据
            this.skuInfo.skuDefaultImg = row.imgUrl
        },
        //保存
        async saveSkuInfo() {
            try {
                //结构数据
                const { attrInfoList, spuSaleAttrList, imageList, skuInfo } = this
                //整理平台属性数据
                //声明一个初始值
                let arr = []
                //最后的返回值赋值给了 skuInfo.skuAttrValueList
                skuInfo.skuAttrValueList = attrInfoList.reduce((prev, item) => {
                    if (item.attrValueInfo) {
                        let [attrId, valueId] = item.attrValueInfo.split(':')
                        prev.push({ attrId, valueId })
                    }
                    return prev
                }, arr)
                //整理销售属性数据
                //声明初始值
                let init = []
                skuInfo.skuSaleAttrValueList = spuSaleAttrList.reduce((prev, item) => {
                    if (item.spuSaleAttrInfo) {
                        let [saleAttrId, saleAttrValueId] = item.spuSaleAttrInfo.split(':')
                        prev.push({ saleAttrId, saleAttrValueId })
                    }
                    return prev
                }, init)
                //整理图片数据
                skuInfo.skuImageList = imageList.map(item => {
                    return {
                        imgName: item.imgName,
                        imgUrl: item.imgUrl,
                        isDefault: item.isDefault,
                        spuImgId: item.id
                    }
                })
                //发请求
                await this.$API.sku.reqSaveSkuInfo(skuInfo)
                //提示信息
                this.$message({ type: 'success', message: '添加sku成功' })
                //切换为显示数据列表
                this.$emit('sku')
                Object.assign(this._data, this.$options.data())
            } catch (error) {
                console.log(error)
            }
        },
        //取消按钮的回调
        cancel() {
            this.$emit('sku')
            Object.assign(this._data, this.$options.data())
        }
    },
}
</script>

<style>
</style>