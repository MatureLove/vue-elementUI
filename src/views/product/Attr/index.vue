<template>
    <div>
        <el-card style="margin-bottom:20px">
            <CategorySelect @getCategoryId="getCategoryId" :isShow="isShow"></CategorySelect>
        </el-card>
        <el-card>
            <!-- 点击添加属性让isshow变为false隐藏 -->
            <div v-show="isShow">
                <!-- category3Id当为空字符串的时候，让添加属性按钮禁止点，当有category3Id之后在取消 点击添加属性让isshow变为false隐藏-->
                <el-button type="primary" icon="el-icon-plus" :disabled="!category3Id" @click="addAttr">添加属性
                </el-button>
                <el-table :data="attrList" border style="margin:20px 0">
                    <el-table-column type="index" label="序号" width="80" align="center"></el-table-column>
                    <el-table-column prop="attrName" label="属性名称" width="120"></el-table-column>
                    <el-table-column label="属性值列表">
                        <template slot-scope="{row,$index}">
                            <el-tag type="success" v-for="(attr, index) in row.attrValueList" :key="attr.id"
                                style="margin:0 20px">{{
                                        attr.valueName
                                }}</el-tag>
                        </template>
                    </el-table-column>
                    <el-table-column prop="" label="操作" width="140">
                        <template slot-scope="{row,$index}">
                            <el-button type="warning" icon="el-icon-edit" size="mini" @click="updateAttr(row)">
                            </el-button>
                            <el-button type="danger" icon="el-icon-delete" size="mini" @click="deleteAttr(row)">
                            </el-button>
                        </template>
                    </el-table-column>
                </el-table>
            </div>
            <!-- 当进行添加或者修改操作的时候显示 -->
            <div v-show="!isShow">
                <el-form :inline="true" class="demo-form-inline" :model="attrInfo" :rules="rules" ref="ruleForm">
                    <el-form-item label="属性名" prop="attrName">
                        <el-input placeholder="请输入属性名" v-model="attrInfo.attrName"></el-input>
                    </el-form-item>
                </el-form>
                <el-button type="primary" icon="el-icon-plus" :disabled="!attrInfo.attrName" @click="addAttrNum">添加属性值
                </el-button>
                <el-button @click="isShow = true">取消</el-button>
                <el-table border style="margin:20px 0" :data="attrInfo.attrValueList">
                    <el-table-column label="序号" type="index" align="center" width="80"></el-table-column>
                    <el-table-column label="属性值名称">
                        <template slot-scope="{row,$index}">
                            <el-input v-model="row.valueName" placeholder="请输入属性值名称" size="mini" v-if="row.flag"
                                @blur="isFlag(row)" @keyup.native.enter="isFlag(row)" :ref="$index">
                            </el-input>
                            <span v-else @click="isEdit(row, $index)">{{ row.valueName }}</span>
                        </template>
                    </el-table-column>
                    <el-table-column label="操作">
                        <template slot-scope="{row,$index}">
                            <el-popconfirm :title="`属性值${row.valueName}确定删除吗？`" @onConfirm="deleteAttrValue($index)">
                                <el-button type="danger" icon="el-icon-delete" size="mini" slot="reference">
                                </el-button>
                            </el-popconfirm>
                        </template>
                    </el-table-column>
                </el-table>
                <el-button type="primary" @click="saveAttrInfo('ruleForm')" :disabled="!attrInfo.attrValueList.length">
                    保存
                </el-button>
                <el-button @click="isShow = true">取消</el-button>
            </div>
        </el-card>
    </div>
</template>

<script>
//引入lodash进行深拷贝
import cloneDeep from 'lodash/cloneDeep'
export default {
    name: 'Attr',
    data() {
        //表单验证
        let validateAttrName = (rule, value, callback) => {
            let len = value.length
            if (len < 2 || len > 8) {
                callback(new Error('用户名长度在2-8之间'))
            } else {
                callback()
            }
        }
        return {
            category1Id: '', //一级分类id
            category2Id: '',//二级分类id
            category3Id: '',//三级分类id
            attrList: [], //商品数据
            //判断添加属性是否展示
            isShow: true,
            attrInfo: {
                attrName: "",
                attrValueList: [
                ],
                categoryId: 0,
                categoryLevel: 3,
            },
            //验证规则
            rules: {
                attrName: [{ validator: validateAttrName, trigger: 'blur' }]
            }
        }
    },
    methods: {
        //获取一二三级列表id
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
                this.getAttrList()

            }
        },
        //获取行品列表
        async getAttrList() {
            try {
                const { category1Id, category2Id, category3Id } = this
                let result = await this.$API.attr.reqAttrInfoList(category1Id, category2Id, category3Id)
                this.attrList = result.data
            } catch (error) {
                console.log(error)
            }
        },
        //添加属性值
        addAttrNum() {
            this.attrInfo.attrValueList.push({
                attrId: this.attrInfo.id,//当点击修改的时候因为用到了深拷贝所以attrinfo已经有了id值，所以在这就可以获取到id值，但如果不是点的修改
                //而是直接点的添加属性值，因为获取不到id所以id就是underfind
                valueName: "",
                flag: true
            })
            //添加属性值时也自动获取焦点,因为添加的时候是通过push添加，所以直接获取数组的最后一个获取焦点
            this.$nextTick(() => {
                this.$refs[this.attrInfo.attrValueList.length - 1].focus()
            })
        },
        //添加属性的回调
        addAttr() {
            //判断添加属性是否展示
            this.isShow = false
            //清空之前的数据
            this.attrInfo = {
                attrName: "",
                attrValueList: [
                ],
                categoryId: this.category3Id,
                categoryLevel: 3,
            }
        },
        //修改属性的回调
        updateAttr(row) {
            //隐藏数据列表
            this.isShow = false
            this.attrInfo = cloneDeep(row)
            //给原有的对象添加flag属性
            this.attrInfo.attrValueList.forEach(item => {
                this.$set(item, 'flag', false)
            })
        },
        //input框失去焦点时的回调,表单验证，变为span
        isFlag(row) {
            //验证输入的是否是空格
            if (row.valueName.trim() === '') {
                return this.$message.error('属性值不能为空！！')
            }
            //验证是否有重名
            let result = this.attrInfo.attrValueList.some(item => {
                if (row !== item) {
                    return row.valueName === item.valueName
                }
            })
            if (result) {
                return this.$message.error('属性值已经存在！！')
            }
            row.flag = false
        },
        //span变成input时自动获取焦点
        isEdit(row, index) {
            row.flag = true
            //定时器方法不好
            // setTimeout(() => {
            //     this.$refs[index].focus()
            // }, 0)
            this.$nextTick(() => {
                this.$refs[index].focus()
            })
        },
        //删除属性值
        deleteAttrValue(index) {
            //删除当前下标的值
            // console.log(index)
            this.attrInfo.attrValueList.splice(index, 1)
        },
        //保存按钮的回调
        saveAttrInfo(formName) {
            this.$refs[formName].validate(async (valid) => {
                if (valid) {
                    //整理数据，将属性值为空的过滤掉，将flag属性去除
                    this.attrInfo.attrValueList = this.attrInfo.attrValueList.filter(item => {
                        //将不等于空的删除flag属性
                        if (item.valueName !== '') {
                            //删除flag属性
                            delete item.flag
                            return true
                        }
                    })
                    try {
                        //发送请求
                        await this.$API.attr.reqAddOrUpdateAttrInfo(this.attrInfo)
                        //显示数据列表
                        this.isShow = true
                        //提示信息
                        this.$message({ type: 'success', message: '保存成功' })
                        //重新获取数据
                        this.getAttrList()
                    } catch (error) {
                        this.$message.error('保存失败！')
                    }
                } else {
                    console.log('error submit!!');
                    return false;
                }
            })

        },
        //删除属性
        deleteAttr(row) {
            this.$confirm(`此操作将永久删除${row.attrName}, 是否继续?`, '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(async () => {
                //发送请求删除属性
                try {
                    await this.$API.attr.reqDeleteAttr(row.id)
                    //重新获取数据
                    this.getAttrList()
                    //提示信息
                    this.$message({
                        type: 'success',
                        message: '删除成功!'
                    });
                } catch (error) {
                    this.$message({
                        type: 'warning',
                        message: error.message
                    });
                }
            }).catch(() => {
                this.$message({
                    type: 'info',
                    message: '已取消删除'
                });
            });
        }
    },
}
</script>

<style scoped>
</style>>


