<template>
    <div>
        <el-form :inline="true" class="demo-form-inline">
            <el-form-item>
                <el-input placeholder="用户名" v-model="tempSearchObj.username"></el-input>
            </el-form-item>
            <el-button type="primary" icon="el-icon-search" @click="search">查询</el-button>
            <el-button @click="resetSearch">清空</el-button>
        </el-form>
        <el-button type="primary" @click="showAddUser">添加</el-button>
        <el-button type="danger" :disabled="selectedIds.length === 0" @click="deleteUsers">批量删除</el-button>
        <!-- @selection-change="handleSelectionChange"选择项发生改变时触发 -->
        <el-table style="width: 100%; margin:20px 0" border :data="userlist" stripe v-loading="listLoading"
            @selection-change="handleSelectionChange">
            <el-table-column type="selection" width="80">
            </el-table-column>
            <el-table-column type="index" label="序号" width="100" align="center">
            </el-table-column>
            <el-table-column prop="username" label="用户名">
            </el-table-column>
            <el-table-column prop="nickName" label="用户昵称">
            </el-table-column>
            <el-table-column prop="roleName" label="权限列表">
            </el-table-column>
            <el-table-column prop="gmtCreate" label="创建时间">
            </el-table-column>
            <el-table-column prop="gmtModified" label="更新时间">
            </el-table-column>
            <el-table-column prop="address" label="操作" align="center">
                <template slot-scope="{row}">
                    <el-button size="mini" type="info" icon="el-icon-s-check" title="分配角色" @click="showAssignRole(row)">
                    </el-button>
                    <el-button style="margin:0 15px" size="mini" type="primary" icon="el-icon-edit" title="修改用户"
                        @click="updateUser(row)">
                    </el-button>
                    <el-popconfirm icon="el-icon-info" iconColor="red" :title="`确定删除吗${row.username}？`"
                        @onConfirm="deleteUser(row)">
                        <el-button slot="reference" size="mini" type="danger" icon="el-icon-delete" title="删除用户">
                        </el-button>
                    </el-popconfirm>
                </template>
            </el-table-column>
        </el-table>
        <!-- 分页器 -->
        <!--  @current-change="getTradMarkList" @size-change="chagePage"
            @prev-click="getTradMarkList" @next-click="getTradMarkList" -->
        <el-pagination :total="total" :current-page="page" :page-size="limit" :page-sizes="[5, 10, 15]" :pager-count="7"
            layout="prev, pager, next,jumper,->,sizes,total" @current-change="getAclUserList" @size-change="chagePage"
            @prev-click="getAclUserList" @next-click="getAclUserList">

        </el-pagination>
        <!-- 对话框 -->
        <el-dialog :title="user.id ? '修改用户' : '添加用户'" :visible.sync="dialogFormVisible">
            <el-form label-width="120px" :model="user" ref="userForm" :rules="userRules">
                <el-form-item label="用户名" prop="username">
                    <el-input v-model="user.username"></el-input>
                </el-form-item>
                <el-form-item label="用户昵称">
                    <el-input v-model="user.nickName"></el-input>
                </el-form-item>
                <el-form-item label="用户密码" v-if="!user.id" prop="password">
                    <el-input v-model="user.password"></el-input>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click="cancel">取 消</el-button>
                <el-button type="primary" @click="addUser" :loading="loading">确 定</el-button>
            </div>
        </el-dialog>
        <!-- 分配角色对话框 -->
        <el-dialog title="设置角色" :visible.sync="dialogRoleVisible">
            <el-form label-width="100px">
                <el-form-item label="用户名">
                    <el-input disabled :value="user.username"></el-input>
                </el-form-item>
                <el-form-item label="角色列表">
                    <el-checkbox :indeterminate="isIndeterminate" v-model="checkAll" @change="handleCheckAllChange">全选
                    </el-checkbox>
                    <div style="margin: 15px 0;"></div>
                    <el-checkbox-group v-model="userRoleIds" @change="handleCheckedChange">
                        <el-checkbox v-for="role in allRoles" :key="role.id" :label="role.id">{{ role.roleName }}
                        </el-checkbox>
                    </el-checkbox-group>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button type="primary" @click="assignRole" :loading="loading">保 存</el-button>
                <el-button @click="resetRoleData">取 消</el-button>
            </div>
        </el-dialog>
    </div>
</template>

<script>
import cloneDeep from 'lodash/cloneDeep'
export default {
    name: 'User',
    data() {
        //密码校验规则 

        const validatePassword = (rule, value, callback) => {
            if (!value) {
                callback('密码必须输入')
            } else if (!value || value.length < 6) {
                callback('密码不能小于6位')
            } else {
                callback()
            }
        }
        return {
            dialogFormVisible: false,//对话框是否显示
            userlist: [],//用户分页列表
            page: 1, //当前页
            limit: 5, //每页展示多少条数据
            total: 0, //总页数
            listLoading: false, // 是否显示列表加载的提示
            searchObj: { // 包含请求搜索条件数据的对象
                username: ''
            },
            tempSearchObj: { // 收集搜索条件输入的对象
                username: ''
            },
            selectedIds: [],//接受用户选中数据的id
            user: {},//收集用户添加的数据
            //添加用户信息的校验规则
            userRules: {
                username: [
                    { required: true, message: '用户名必须输入' },
                    { min: 2, message: '用户名不能小于2位' },
                ],
                password: [
                    { required: true, validator: validatePassword }
                ]
            },
            loading: false, // 是否正在提交请求中 , 按钮上有加载效果
            dialogRoleVisible: false,//分配角色对话框
            isIndeterminate: false,//分配角色多选框
            checkAll: false, // 是否全选
            allRoles: [], // 所有角色列表
            userRoleIds: [], // 用户的角色ID的列表
        }
    },
    mounted() {
        this.getAclUserList()
    },
    methods: {
        //获取用户分页列表
        async getAclUserList(pager = 1) {
            try {
                this.page = pager
                const { page, limit, searchObj } = this
                this.listLoading = true
                let result = await this.$API.user.reqGetAclUserList(page, limit, searchObj)
                this.listLoading = false
                this.userlist = result.data.items
                this.total = result.data.total
            } catch (error) {
                this.$message.error(error.message)
            }

        },
        //改变每页展示多少条数据
        chagePage(limit) {
            this.limit = limit
            this.getAclUserList()
        },
        //根据输入进行搜索
        search() {
            this.searchObj = { ...this.tempSearchObj }
            this.getAclUserList()
        },
        //清空
        resetSearch() {
            this.searchObj = { // 包含请求搜索条件数据的对象
                username: ''
            }
            this.tempSearchObj = { // 收集搜索条件输入的对象
                username: ''
            }
            this.getAclUserList()
        },
        //表格选项 会接受选中的数据是一个数组
        handleSelectionChange(selection) {
            this.selectedIds = selection.map(item => item.id)
        },
        //添加
        showAddUser() {
            this.user = {}
            this.dialogFormVisible = true
            // 移除对表单的校验结果
            this.$nextTick(() => this.$refs.userForm.clearValidate())
        },
        //确定按钮新增用户
        addUser() {
            this.$refs.userForm.validate(async (valid) => {
                if (valid) {
                    try {
                        const { user } = this
                        this.loading = true
                        await this.$API.user[user.id ? 'reqUpdateUser' : 'reqAddUser'](user)
                        this.loading = false
                        this.$message.success('保存成功!')
                        this.getAclUserList(user.id ? this.page : 1)
                        this.user = {}
                        this.dialogFormVisible = false
                    } catch (error) {
                        this.$message.error(error.message)
                    }
                } else {
                    this.$message.error('添加失败1')
                }
            })
        },
        //取消按钮的回调
        cancel() {
            this.user = {}
            this.dialogFormVisible = false
        },
        //批量删除
        deleteUsers() {
            this.$confirm('确定删除选中项吗?',).then(async () => {
                try {
                    await this.$API.user.reqBatchRemove(this.selectedIds)
                    this.$message({
                        type: 'success',
                        message: '删除成功!'
                    });
                    this.getAclUserList()
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
        //分配角色
        async showAssignRole(row) {
            try {
                this.user = row
                // console.log(row)
                this.dialogRoleVisible = true
                let result = await this.$API.user.reqGetToAssign(this.user.id)
                this.allRoles = result.data.allRolesList  //所有的角色列表
                this.userRoleIds = result.data.assignRoles.map(item => item.id) //已有的角色列表的id
                //如果所有的角色列表的数组长度等于已有的角色列表的数组的长度，将全选按钮设置为true
                //如果有选中的角色列表，但没选完，将isIndeterminate设为true，他控制的是全选按钮中的那个横杠
                this.checkAll = result.data.allRolesList.length === result.data.assignRoles.length
                this.isIndeterminate = result.data.assignRoles.length > 0 && result.data.assignRoles.length < result.data.allRolesList.length
            } catch (error) {
                console.log(error.message)
            }
        },
        //全选按钮发生改变 value为true表示选中false表示没选
        handleCheckAllChange(value) {
            // 如果当前全选, userRoleIds就是所有角色id的数组, 否则是空数组
            this.userRoleIds = value ? this.allRoles.map(item => item.id) : []
            // 如果当前不是全选也不全不选时, 指定为false ，有选中的但不是全选
            this.isIndeterminate = false
        },
        //单选按钮发生改变 value是选中的id放在一个数组里了
        handleCheckedChange(value) {
            const { userRoleIds, allRoles } = this
            //如果所有的角色列表的数组长度等于已有的角色列表的数组的长度，将全选按钮设置为true
            //如果有选中的角色列表，但没选完，将isIndeterminate设为true，他控制的是全选按钮中的那个横杠
            this.checkAll = userRoleIds.length === allRoles.length && allRoles.length > 0
            this.isIndeterminate = userRoleIds.length > 0 && userRoleIds.length < allRoles.length
        },
        //保存分配的角色
        async assignRole() {
            try {
                this.loading = true
                const { user, userRoleIds } = this
                const roleId = userRoleIds.join(',')
                let result = await this.$API.user.reqDoAssign(user.id, roleId)
                this.loading = false
                this.$message.success('保存成功')
                this.resetRoleData()
                this.getAclUserList(this.page)
            } catch (error) {
                console.log(error.message)
            }
        },
        //重置用户角色的数据
        resetRoleData() {
            this.dialogRoleVisible = false
            this.allRoles = []
            this.userRoleIds = []
            this.isIndeterminate = false
            this.checkAll = false
        },
        //修改用户
        updateUser(row) {
            this.user = cloneDeep(row)
            this.dialogFormVisible = true
        },
        //删除用户
        async deleteUser(row) {
            try {
                await this.$API.user.removeUser(row.id)
                this.$message.success('删除成功')
                this.getAclUserList(this.user.length === 1 ? this.page - 1 : this.page)
            } catch (error) {
                this.$message.error(error)
            }
        }
    }
}
</script>

<style>
</style>