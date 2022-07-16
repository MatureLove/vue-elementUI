<template>
    <div>
        <el-form label-width="80px" ref="form" :model="supInfo">
            <el-form-item label="SPU名称">
                <el-input placeholder="SPU名称" v-model="supInfo.spuName"></el-input>
            </el-form-item>
            <el-form-item label="品牌">
                <el-select v-model="supInfo.tmId" placeholder="请选择品牌">
                    <el-option :label="tm.tmName" :value="tm.id" v-for="(tm, index) in TrademarkList" :key="tm.id">
                    </el-option>
                </el-select>
            </el-form-item>
            <el-form-item label="SPU描述">
                <el-input placeholder="SPU描述" type="textarea" rows="4" v-model="supInfo.description"></el-input>
            </el-form-item>
            <el-form-item label="SPU图片">
                <!--list-type="picture-card" 照片墙  action上传地址  on-preview点击已上传的文件是触发的回调 on-remove文件列表移除文件时触发-->
                <el-upload action="/dev-api/admin/product/fileUpload" :file-list="supImagelist" list-type="picture-card"
                    :on-preview="handlePictureCardPreview" :on-remove="handleRemove" :on-success="handleSuccess">
                    <i class="el-icon-plus"></i>
                </el-upload>
                <!-- dialogVisible控制对话框显示与隐藏 -->
                <el-dialog :visible.sync="dialogVisible">
                    <img width="100%" :src="dialogImageUrl">
                </el-dialog>
            </el-form-item>
            <el-form-item label="销售属性">
                <el-select :placeholder="spuSalettr.length > 0 ? `还有${spuSalettr.length}未选则` : '你没有可添加的销售属性'"
                    v-model="supInfo.spuSalettridOrName">
                    <el-option :label="Salettr.name" :value="`${Salettr.id}:${Salettr.name}`"
                        v-for="(Salettr, index) in spuSalettr" :key="Salettr.id"></el-option>
                </el-select>
                <el-button type="primary" icon="el-icon-plus" :disabled="!supInfo.spuSalettridOrName"
                    @click="addSpuSalettrList">添加销售属性</el-button>
                <el-table border :data="supInfo.spuSaleAttrList" style="width:100%">
                    <el-table-column label="序号" type="index" align="center" width="80"></el-table-column>
                    <el-table-column label="属性名" prop="saleAttrName" width="width"></el-table-column>
                    <el-table-column label="属性值名称列表" width="width">
                        <template slot-scope="{row,$index}">
                            <el-tag :key="tag.id" v-for="(tag, index) in row.spuSaleAttrValueList" closable
                                :disable-transitions="false" @close="row.spuSaleAttrValueList.splice(index, 1)">
                                {{ tag.saleAttrValueName }}
                            </el-tag>
                            <el-input class="input-new-tag" v-if="row.inputVisible" v-model="row.inputValue"
                                ref="saveTagInput" size="small" @keyup.enter.native="handleInputConfirm(row)"
                                @blur="handleInputConfirm(row)">
                            </el-input>
                            <el-button v-else class="button-new-tag" size="small" @click="addSaleAttrValueName(row)">添 加
                            </el-button>
                        </template>
                    </el-table-column>
                    <el-table-column label="操作">
                        <template slot-scope="{row,$index}">
                            <el-button type="danger" icon="el-icon-delete" @click="deleteSpu($index)"></el-button>
                        </template>
                    </el-table-column>
                </el-table>
            </el-form-item>
            <el-form-item>
                <el-button type="primary" @click="saveOrUpdateSpuInfo">保存</el-button>
                <el-button @click="cancel">取消</el-button>
            </el-form-item>
        </el-form>
    </div>
</template>

<script>
export default {
    name: 'AddSpu',
    data() {
        return {
            dialogImageUrl: '',
            dialogVisible: false,
            //某一个SPU信息
            supInfo: {
                //三级id
                category3Id: 0,
                //spu描述
                description: "",
                //SPU名称
                spuName: "",
                //品牌id
                tmId: '',
                //SPU图片
                spuImageList: [
                ],
                //销售属性
                spuSaleAttrList: [
                ],
                spuSalettridOrName: ''
            },
            //品牌信息
            TrademarkList: [],
            //获取SPU图片
            supImagelist: [],
            //获取平台中所有的销售属性（总共3个）
            baseSaleAttrList: []
        }
    },
    methods: {
        //删除已上传图片的回调
        handleRemove(file, fileList) {
            //file，删除图片的信息，fileList：删除成功后的数组
            // console.log(fileList)
            //将删除成功后的数组收集起来
            this.supImagelist = fileList
        },
        //预览图片时触发的回调
        handlePictureCardPreview(file) {
            //file当前图片的信息
            //将图片的url赋值给这个变量，用来显示图片
            this.dialogImageUrl = file.url;
            //控制是否显示
            this.dialogVisible = true;
        },
        //上传成功的回调
        handleSuccess(response, file, fileList) {
            //response上传成功返回的信息
            //file:上传的照片
            //fileList：上传成功之后的数组
            this.supImagelist = fileList
        },
        //发送请求的方法
        async getSpuInfo(row) {
            try {
                // console.log('发请求', row)
                //获取某一个supinfo信息
                let info = await this.$API.spu.reqGetSpuInfo(row.id)
                this.supInfo = info.data
                //获取品牌的数据
                let tmList = await this.$API.spu.reqTmList()
                this.TrademarkList = tmList.data
                //获取SPU图片
                let supImage = await this.$API.spu.reqSpuImageList(row.id)
                let { data } = supImage
                //给返回的数据添加name和url属性，因为elementui中需要有这两个属性才能显示图片
                data.forEach(item => {
                    item.name = item.imgName
                    item.url = item.imgUrl
                })
                this.supImagelist = data
                //获取平台中全部的销售属性
                let BaseSaleAttrList = await this.$API.spu.reqBaseSaleAttrList()
                this.baseSaleAttrList = BaseSaleAttrList.data
            } catch (error) {
                console.log(error.message)
            }
        },
        //添加销售属性
        addSpuSalettrList() {
            const arr = this.supInfo.spuSalettridOrName.split(':')
            this.supInfo.spuSaleAttrList.push({ baseSaleAttrId: arr[0], saleAttrName: arr[1], spuSaleAttrValueList: [] })
            this.supInfo.spuSalettridOrName = ''
        },
        //添加销售属性值
        addSaleAttrValueName(row) {
            //给row下添加inputVisible控制input和button的切换
            this.$set(row, 'inputVisible', true)
            //用来接受输入框的值
            this.$set(row, 'inputValue', '')
            //切换为inpu后自动获取焦点
            this.$nextTick(() => {
                this.$refs.saveTagInput.$refs.input.focus();
            });
        },
        //失去焦点回调
        handleInputConfirm(row) {
            //判断输入内容是否为空
            if (row.inputValue.trim() === '') {
                return this.$message.error('属性值不能为空！')
            }
            //判断属性值是否重复
            let result = row.spuSaleAttrValueList.some(item => {
                return item.saleAttrValueName === row.inputValue
            })
            if (result) {
                return this.$message.error('属性值不能重复！')
            }
            row.spuSaleAttrValueList.push({ baseSaleAttrId: row.baseSaleAttrId, saleAttrValueName: row.inputValue })
            row.inputVisible = false;
            row.inputValue = '';
        },
        //删除属性
        deleteSpu(index) {
            this.supInfo.spuSaleAttrList.splice(index, 1)
        },
        //保存
        async saveOrUpdateSpuInfo() {
            //整理图片信息 对于图片 需要携带imageName和imageUrl字段
            //map返回的时一个新数组，会将回调里面所执行的作为返回值返回
            this.supInfo.spuImageList = this.supImagelist.map(item => {
                return {
                    imageName: item.name,
                    imageUrl: (item.response && item.response.data) || item.url
                }
            })
            try {
                //发送请求
                await this.$API.spu.reqSaveOrUpdateSpuInfo(this.supInfo)
                //提示信息
                this.$message({ type: 'success', message: '保存成功' })
                //跳转页面
                this.$emit('repAdd', { flag: this.supInfo.id ? '修改' : '添加' })
                //清除数据
                //Object.assign合并对象
                //_data身上的所有数据都来自于data，又利用数据代理将_data身上的属性添加到了vm上
                //this.$options.data()当前组件的配置对象，身上有data函数，他每次返回的都是一个全新的值
                Object.assign(this._data, this.$options.data())

            } catch (error) {
                console.log(error.message)
            }

        },
        //添加spu
        async addSpuInfo(category3Id) {
            this.supInfo.category3Id = category3Id
            try {
                //获取品牌的数据
                let tmList = await this.$API.spu.reqTmList()
                this.TrademarkList = tmList.data
                //获取平台中全部的销售属性
                let BaseSaleAttrList = await this.$API.spu.reqBaseSaleAttrList()
                this.baseSaleAttrList = BaseSaleAttrList.data
            } catch (error) {
                console.log(error.message)
            }
        },
        //取消
        cancel() {
            this.$emit('repAdd', {
                flag: ''
            })
            //清除数据
            //Object.assign合并对象
            //_data身上的所有数据都来自于data，又利用数据代理将_data身上的属性添加到了vm上
            //this.$options.data()当前组件的配置对象，身上有data函数，他每次返回的都是一个全新的值
            Object.assign(this._data, this.$options.data())
        }
    },
    computed: {
        //计算未添加的销售属性
        spuSalettr() {
            return this.baseSaleAttrList.filter(item => {
                return this.supInfo.spuSaleAttrList.every(item1 => {
                    return item.name !== item1.saleAttrName
                })
            })
        }
    }
}
</script>

<style>
.el-tag+.el-tag {
    margin-left: 10px;
}

.button-new-tag {
    margin-left: 10px;
    height: 32px;
    line-height: 30px;
    padding-top: 0;
    padding-bottom: 0;
}

.input-new-tag {
    width: 90px;
    margin-left: 10px;
    vertical-align: bottom;
}
</style>