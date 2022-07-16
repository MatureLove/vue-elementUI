<template>
    <div>
        <!-- 
        code: "Acl" // 标识名称
        deleted: false
        gmtCreate: "2020-11-30 16:40:08"
        gmtModified: "2020-11-30 16:40:08"
        id: "1333329957008228353"
        level: 2
        name: "权限管理"
        pid: "1" // 所属节点的id
        select: false
        status: null
        toCode: ""
        type: 1  // 1: 路由 2: 按钮

        children: []
        code: "btn.Role.assgin"
        deleted: false
        gmtCreate: "2020-11-30 16:50:13"
        gmtModified: "2020-12-01 08:13:47"
        id: "1333332492158812161"
        level: 4
        name: "分配权限"
        pid: "1333330152781561858"
        select: false
        status: null
        toCode: "RoleAuth"
        type: 2
    -->
        <!-- :data="menuPermissionList"    :expand-row-keys可以通过该属性设置 Table 默认展开行，
        需要设置 row-key 属性才能使用，该属性为展开行的 keys 数组。 row-key行数据的 Key，用来优化 Table 的渲染； -->
        <el-table border style="margin-bottom: 20px;" :expand-row-keys="expandKeys" row-key="id"
            :data="menuPermissionList">
            <el-table-column prop="name" label="名称" />
            <el-table-column prop="code" label="权限值" />
            <el-table-column prop="toCode" label="跳转权限值" />
            <el-table-column label="操作">
                <template slot-scope="{row}">
                    <HintButton type="primary" icon="el-icon-plus" size="mini" :disabled="row.level === 4"
                        :title="getAddTitle(row.level)" @click="toAddPermission(row)" />
                    <HintButton type="primary" icon="el-icon-edit" size="mini" :disabled="row.level === 1"
                        :title="row.level === 4 ? '修改功能' : '修改菜单'" @click="toUpdatePermission(row)" />
                    <HintButton type="danger" icon="el-icon-delete" size="mini" title="删除" :disabled="row.level === 1"
                        @click="removePermission(row)" />
                </template>
            </el-table-column>
        </el-table>
        <!-- 弹框 -->
        <el-dialog :visible.sync="dialogPermissionVisible" :title="dialogTitle" @close="resetData">
            <el-form ref="permission" label-width="120px" :model="permission" :rules="permissionRules">
                <!-- 修改一律不现实父级名称，只有点击level为2的按钮时，然后添加的菜单和功能level需要+1，所以level为3，
                    也就是level大于2的时候显示父节点
                     -->
                <el-form-item label="父级名称" v-if="permission.level > 2 && !permission.id">
                    <el-input disabled :value="permission.pname" />
                </el-form-item>
                <el-form-item label="名称" prop="name">
                    <el-input v-model="permission.name" />
                </el-form-item>

                <el-form-item label="功能权限值" prop="code">
                    <el-input v-model="permission.code" />
                </el-form-item>
                <el-form-item label="跳转路由权限值" prop="toCode" v-if="permission.level === 4">
                    <el-input v-model="permission.toCode" />
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click="resetData">取 消</el-button>
                <el-button type="primary" @click="addOrUpdatePermission">确 定</el-button>
            </div>
        </el-dialog>
    </div>
</template>

<script>
// 菜单权限校验的规则
const menuRules = {
    name: [{ required: true, message: '名称必须输入' }],
    code: [{ required: true, message: '权限值必须输入' }]
}
const btnRules = {
    name: [{ required: true, message: '名称必须输入' }],
    code: [{ required: true, trigger: 'blur', message: '功能权限值必须输入' }]
}
export default {
    name: 'Permission',
    data() {
        return {
            dialogPermissionVisible: false,//控制弹框是否显示
            menuPermissionList: [], //菜单数据列表
            expandKeys: [], // 需要自动展开的项
            permission: { // 要操作的菜单权限对象
                level: 0, //新增菜单的level
                name: '', //新增菜单（或功能）的名字
                code: '', //权限名，后去用于判断用户登录是否显示
                toCode: '' //跳转权限值
            },
        }
    },
    computed: {
        //计算弹框的标题
        dialogTitle() {
            const { id, level } = this.permission
            //如果有id表示是修改，除了当level等于4时为修改功能其余全部是修改菜单
            if (id) {
                return level === 4 ? '修改功能' : '修改菜单'
            } else {
                //当没有id时表示添加功能或菜单，每次点击的时候level等于当前父节点的level+1，
                return level === 4 ? '添加功能' : `添加${level === 2 ? '一级' : '二级'}菜单`
            }
        },
        //验证规则
        permissionRules() {
            //如果等于4用的时添加功能的规则，否则是添加菜单的规则
            return this.permission.level === 4 ? btnRules : menuRules
        }

    },
    mounted() {
        this.fetchPermissionList()
    },
    methods: {
        //获取列表数据
        async fetchPermissionList() {
            //发送请求
            let result = await this.$API.permission.reqPermission()
            //存放数据
            this.menuPermissionList = result.data.children
            //将children下面的最外层父节点默认展开
            this.expandKeys = [this.menuPermissionList[0].id]
        },
        /* 
根据级别得到要显示的添加dialog的标题
*/
        getAddTitle(level) {
            if (level === 1 || level === 2) {
                return '添加菜单'
            } else if (level === 3) {
                return '添加功能'
            }
        },
        //显示添加权限的界面(菜单或功能)
        // 添加菜单需要携带的参数 code level name pid tocode type
        toAddPermission(row) {
            this.dialogPermissionVisible = true
            this.permission.pid = row.id //所属节点的id ，就是父节点的id
            this.permission.level = row.level + 1 //因为添加的菜单或功能都是父节点的字节带你所以就是当前父节点的level+1
            this.permission.type = this.permission.level === 4 ? 2 : 1  //当level等于四时添加的时功能也就是按钮，2代表按钮
            this.permission.pname = row.name // 用于显示父名称, 但提交请求时是不需要的

            // 清除校验(必须在界面更新之后)
            this.$nextTick(() => this.$refs.permission.clearValidate())
        },

        //添加菜单或添加功能确定按钮
        addOrUpdatePermission() {
            this.$refs.permission.validate(async (valid) => {
                if (valid) {
                    try {
                        //整理参数，利用结构赋值将pname结构出来，...perm是剩下的参数
                        const { pname, ...perm } = this.permission
                        await this.$API.permission[perm.id ? 'reqUpdateMeny' : 'reqAddMeny'](perm)
                        this.$message.success(`${perm.id ? '修改' : '添加'}成功!`)
                        this.resetData()
                        this.fetchPermissionList()
                    } catch (error) {
                        console.log(error)
                    }
                } else {
                    this.$message.error('验证失败')
                }
            })
        },
        // 重置数据
        resetData() {
            this.dialogPermissionVisible = false
            this.permission = {
                level: 0,
                name: '',
                code: '',
                toCode: ''
            }
        },
        //修改菜单
        toUpdatePermission(row) {
            console.log(row)
            this.dialogPermissionVisible = true
            this.permission = { ...row }
            this.permission.type = this.permission.level === 4 ? 2 : 1

            // 清除校验(必须在界面更新之后)
            this.$nextTick(() => this.$refs.permission.clearValidate())
        },
        //删除菜单
        removePermission(row) {
            this.$confirm('此操作将永久删除该菜单, 是否继续?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(async () => {
                try {
                    await this.$API.permission.reqDeleteMeny(row.id)
                    this.$message({
                        type: 'success',
                        message: '删除成功!'
                    });
                    this.fetchPermissionList()
                } catch (error) {
                    console.log(error)
                }
            }).catch(() => {
                this.$message({
                    type: 'info',
                    message: '已取消删除'
                });
            });
        }
    }
}
</script>

<style>
</style>