<template>
    <div>
        <el-form :inline="true" class="demo-form-inline">
            <el-form-item>
                <el-input placeholder="用户名" v-model="tempSearchObj.roleName"></el-input>
            </el-form-item>
            <el-button type="primary" icon="el-icon-search" @click="search">查询</el-button>
            <el-button @click="resetSearch">清空</el-button>
        </el-form>
        <el-button type="primary" @click="addRole">添加</el-button>
        <el-button type="danger" :disabled="!selectedRoles.length" @click="deleteallRole">批量删除</el-button>
        <el-table style="width: 60%; margin:20px 0" border :data="roleList" stripe v-loading="listLoading"
            @selection-change="handleSelectionChange">
            <el-table-column type="selection" width="80">
            </el-table-column>
            <el-table-column type="index" label="序号" width="100" align="center">
            </el-table-column>
            <el-table-column label="角色名称">
                <template slot-scope="{row}">
                    <template v-if="row.edit">
                        <el-input class="edit-input" size="small" v-model="row.roleName" />
                        <el-button class="cancel-btn" size="small" icon="el-icon-refresh" type="warning"
                            @click="cancel(row)">
                            取消
                        </el-button>
                    </template>
                    <span v-if="!row.edit">{{ row.roleName }}</span>
                </template>
            </el-table-column>
            <el-table-column label="操作" align="center" width="300">
                <template slot-scope="{row}">
                    <el-button size="mini" type="info" icon="el-icon-info" title="分配权限" @click="toTree(row)">
                    </el-button>
                    <el-button size="mini" type="primary" icon="el-icon-edit" style="margin:0 10px 0 20px"
                        v-if="!row.edit" title="修改角色" @click="updateRole(row)"></el-button>
                    <el-button size="mini" type="primary" icon="el-icon-check" style="margin:0 10px 0 20px"
                        v-if="row.edit" title="确定" @click="confirm(row)"></el-button>
                    <el-button size="mini" type="danger" icon="el-icon-delete" title="删除角色" @click="deleteRole(row)">
                    </el-button>
                </template>
            </el-table-column>
        </el-table>
        <!-- 分页器 -->
        <!--  @current-change="getTradMarkList" @size-change="chagePage"
            @prev-click="getTradMarkList" @next-click="getTradMarkList" -->
        <el-pagination :total="total" :current-page="page" :page-size="limit" :page-sizes="[5, 10, 15]" :pager-count="7"
            layout="prev, pager, next,jumper,->,sizes,total" @current-change="getRoleList" @size-change="chagePage"
            @prev-click="getRoleList" @next-click="getRoleList">

        </el-pagination>
    </div>
</template>
<!-- 
    查看角色名称，添加角色名称，修改角色名称，删除角色名称
    给角色分配权限，那些可以访问那些不可访问

 -->
<script>
export default {
    name: 'Role',
    data() {
        return {
            //表格正在加载是否显示
            listLoading: false,
            roleList: [],//分页数据
            page: 1,//当前页
            limit: 5,//每页显示几条数据
            total: 0,//总页数
            //收集搜索数据
            tempSearchObj: {
                roleName: ''
            },
            //发请求带的搜索数据
            searchObj: {
                roleName: ''
            },
            selectedRoles: [] // 所有选中的角色列表
        }
    },
    // 获取页面数据
    mounted() {
        this.getRoleList()
    },
    methods: {
        //获取页面数据
        async getRoleList(page = 1) {
            try {
                this.page = page
                const { limit, searchObj } = this
                this.listLoading = true
                let result = await this.$API.role.reqRoleList(page, limit, searchObj)
                this.listLoading = false
                let items = result.data.items
                items.forEach(item => {
                    item.edit = false // 用于标识是否显示编辑输入框的属性
                    item.originRoleName = item.roleName // 缓存角色名称, 用于取消
                })
                this.roleList = items
                this.total = result.data.total
            } catch (error) {
                console.log(error.message)
            }
        },
        //改变每页显示几条数据
        chagePage(limit) {
            this.limit = limit
            this.getRoleList()
        },
        //查询
        search() {
            this.searchObj = { ...this.tempSearchObj }
            this.getRoleList()
        },
        //清空
        resetSearch() {
            //收集搜索数据
            this.tempSearchObj = {
                roleName: ''
            }
            this.searchObj = {
                roleName: ''
            }
            this.getRoleList()
        },
        //添加
        addRole() {
            this.$prompt('请输入新名称', '添加角色', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
            }).then(async ({ value }) => {
                //value添加的内容
                try {
                    await this.$API.role.reqAddRole({ roleName: value })
                    this.$message({
                        type: 'success',
                        message: '添加成功'
                    });
                    this.getRoleList()
                } catch (error) {
                    this.$message.error('添加失败')
                }
            }).catch(() => {
                this.$message({
                    type: 'info',
                    message: '取消添加'
                });
            });
        },
        //收集选中的数据
        handleSelectionChange(value) {
            this.selectedRoles = value.map(item => {
                return item.id
            })
        },
        //批量删除
        deleteallRole() {
            this.$confirm('此操作将永久删除该角色, 是否继续?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(async () => {
                try {
                    await this.$API.role.reqBatchRemove(this.selectedRoles)
                    this.$message({
                        type: 'success',
                        message: '删除成功!'
                    });
                    this.getRoleList()
                } catch (error) {
                    this.$message.error(error.message)
                }
            }).catch(() => {
                this.$message({
                    type: 'info',
                    message: '已取消删除'
                });
            });
        },
        //修改角色
        updateRole(row) {
            row.edit = true
        },
        //确定修改
        async confirm(row) {
            try {
                await this.$API.role.reqUpdate({ id: row.id, roleName: row.roleName })
                this.$message.success('修改成功')
                row.edit = false
                this.getRoleList(this.page)
            } catch (error) {
                console.log(error)
            }
        },
        //取消修改
        cancel(row) {
            row.edit = false
            row.roleName = row.originRoleName
            this.$message.warning('取消修改')
        },
        //删除角色
        deleteRole(row) {
            this.$confirm(`确定删除${row.roleName}吗?`, '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(async () => {
                try {
                    await this.$API.role.reqDelete(row.id)
                    this.$message({
                        type: 'success',
                        message: '删除成功!'
                    });
                    this.getRoleList(this.roleList.length > 1 ? this.page : this.page - 1)
                } catch (error) {
                    this.$message.error('删除失败')
                }
            }).catch(() => {
                this.$message({
                    type: 'info',
                    message: '已取消删除'
                });
            });
        },
        //跳转到tree路由，分配权限
        toTree(row) {
            this.$router.push({
                name: 'RoleAuth',
                params: {
                    id: row.id
                },
                query: {
                    roleName: row.roleName
                }
            })
        }
    }
}
</script>

<style scoped>
.edit-input {
    padding-right: 100px;
}

.cancel-btn {
    position: absolute;
    right: 15px;
    top: 10px;
}
</style>