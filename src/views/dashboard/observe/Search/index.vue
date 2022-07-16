<template>
    <el-card>
        <div slot="header">
            <div class="card-header">
                <span>线上热门搜索</span>
                <el-dropdown>
                    <span class="el-dropdown-link">
                        <i class="el-icon-more"></i>
                    </span>
                    <el-dropdown-menu slot="dropdown">
                        <el-dropdown-item>黄金糕</el-dropdown-item>
                        <el-dropdown-item>狮子头</el-dropdown-item>
                        <el-dropdown-item>螺蛳粉</el-dropdown-item>
                        <el-dropdown-item>双皮奶</el-dropdown-item>
                        <el-dropdown-item>蚵仔煎</el-dropdown-item>
                    </el-dropdown-menu>
                </el-dropdown>
            </div>
        </div>
        <el-row :gutter="20">
            <el-col :span="12">
                <LineChats title="搜索用户数" count="12321" num="17.1"></LineChats>
            </el-col>
            <el-col :span="12">
                <LineChats title="人均搜索次数" count="2.7" num="26.2"></LineChats>
            </el-col>
        </el-row>
        <!-- 表格 -->
        <el-table :data="tableData" style="width: 100%" border>
            <el-table-column label="排名" width="80" align="center" type="index">
            </el-table-column>
            <el-table-column label="搜索关键字" width="180" prop="word">
            </el-table-column>
            <el-table-column label="用户数" prop="count" sortable>
            </el-table-column>
            <el-table-column label="周涨幅" prop="user" sortable>
            </el-table-column>
        </el-table>
        <!-- 分页 -->
        <el-pagination layout="prev, pager, next" :total="tableData.length" style="margin-top:20px;text-align:center"
            :page-size="5">
        </el-pagination>
    </el-card>
</template>

<script>
import { mapState } from 'vuex'
import LineChats from './lineChats/index';
export default {
    name: "Search",
    components: { LineChats },
    data() {
        return {
        }
    },
    computed: {
        //获取data的数据
        ...mapState({ datalist: state => state.home.datalist }),
        tableData() {
            return this.datalist.searchWord || []
        }
    }
}
</script>

<style scoped>
.card-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
}
</style>