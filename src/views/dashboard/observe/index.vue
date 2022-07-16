<template>
    <el-row :gutter="10">
        <el-col :span="12" class="left">
            <Search></Search>
        </el-col>
        <el-col :span="12" class="right">
            <Category></Category>
        </el-col>
    </el-row>
</template>

<script>
import Search from './Search'
import Category from './Category'
export default {
    name: 'Observe',
    data() {
        return {

        }
    },
    components: { Search, Category }
}
</script>

<style scoped>
</style>