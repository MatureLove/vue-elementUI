<template>
    <div>
        <el-form :inline="true" class="demo-form-inline" :model="cateGory">
            <el-form-item label="一级列表">
                <el-select placeholder="请选择" v-model="cateGory.category1Id" @change="handle1" :disabled="!isShow">
                    <el-option :label="c1.name" :value="c1.id" v-for="(c1, index) in list1" :key="c1.id"></el-option>
                </el-select>
            </el-form-item>
            <el-form-item label="一级列表">
                <el-select placeholder="请选择" v-model="cateGory.category2Id" @change="handel2" :disabled="!isShow">
                    <el-option :label="c2.name" :value="c2.id" v-for="(c2, index) in list2" :key="c2.id"></el-option>
                </el-select>
            </el-form-item>
            <el-form-item label="一级列表">
                <el-select placeholder="请选择" v-model="cateGory.category3Id" @change="handle3" :disabled="!isShow">
                    <el-option :label="c3.name" :value="c3.id" v-for="(c3, index) in list3" :key="c3.id"></el-option>
                </el-select>
            </el-form-item>
        </el-form>
    </div>
</template>

<script>
export default {
    name: 'CategorySelect',
    data() {
        return {
            list1: [],//一级分类数据
            list2: [],//二级分类数据
            list3: [],//三级分类数据
            cateGory: {
                category1Id: '', //一级分类id
                category2Id: '',//二级分类id
                category3Id: ''//三级分类id
            }
        }
    },
    props: ['isShow'],
    mounted() {
        //组件挂在完毕获取一级分类
        this.getCategoryList1()
    },
    methods: {
        //获取一级分类的方法
        async getCategoryList1() {
            try {
                let result = await this.$API.attr.reqGetCategory1()
                this.list1 = result.data
            } catch (error) {
                console.log(error)
            }
        },
        //获取二级分类
        async handle1() {
            try {
                this.list2 = []
                this.list3 = []
                this.cateGory.category2Id = ''
                this.cateGory.category3Id = ''
                const { category1Id } = this.cateGory
                this.$emit('getCategoryId', { categoryId: category1Id, save: 1 })
                let result = await this.$API.attr.reqGetCategory2(category1Id)
                this.list2 = result.data
            } catch (error) {
                console.log(error)
            }

        },
        //获取三级分类
        async handel2() {
            try {
                this.list3 = []
                this.cateGory.category3Id = ''
                const { category2Id } = this.cateGory
                this.$emit('getCategoryId', { categoryId: category2Id, save: 2 })
                let result = await this.$API.attr.reqGetCategory3(category2Id)
                this.list3 = result.data
            } catch (error) {
                console.log(error)
            }
        },
        handle3() {
            const { category3Id } = this.cateGory
            this.$emit('getCategoryId', { categoryId: category3Id, save: 3 })
        }
    }
}
</script>

<style>
</style>