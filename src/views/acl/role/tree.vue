<template>
    <div>
        <el-input :value="$route.query.roleName" disabled></el-input>
        <!--data展示数据  show-checkbox 节点是否可以被选择  node-key 每个树节点用来作为唯一标识的属性，整棵树应该是唯一的 
        default-expanded-keys 默认展开的节点 :default-checked-keys默认选中的节点 props配置选项-->
        <el-tree show-checkbox node-key="id" :props="defaultProps" :data="allPermissions" default-expand-all ref="tree"
            style="margin: 20px 0">
        </el-tree>
        <el-button :loading="loading" type="primary" @click="save">保存</el-button>
        <el-button @click="$router.replace({ name: 'Role' })">取消</el-button>
    </div>
</template>
<!-- 
    1.静态组件
    2.获取权限列表数据
    3.将返回的结果存到data中
    4.将返回的权限列表数据，通过递归将选中的数据返回
    5.通过 keys 设置目前勾选的节点
    6.

 -->
<script>
export default {
    name: 'Tree',
    data() {
        return {
            loading: false,
            // props配置 label指定节点标签为节点对象的某个属性值  children指定子树为节点对象的某个属性值
            defaultProps: {
                children: 'children',
                label: 'name'
            },
            allPermissions: [], // 所有权限列表
        }
    },
    //页面挂载完成也可以用这个发请求，比mounted更早一点
    created() {
        this.getPermissions()
    },
    methods: {
        //获取权限列表数据
        async getPermissions() {
            try {
                const roleId = this.$route.params.id
                let result = await this.$API.role.reqtoAssign(roleId)
                //将返回结果data中的数据取出来
                const allPermissions = result.data.children
                //存到data中
                this.allPermissions = allPermissions
                //得到所有选中的id列表
                const checkedIds = this.getCheckedIds(allPermissions)
                //通过 keys 设置目前勾选的节点,意思大概是将选中的在页面上勾选出来
                this.$refs.tree.setCheckedKeys(checkedIds)
            } catch (error) {
                console.log(error)
            }

        },
        //得到所有选中的id列表 auths接受所有的权限列表，initArr = [] reduce中用到的初始值，空数组
        getCheckedIds(auths, initArr = []) {
            return auths.reduce((pre, item) => {
                if (item.select && item.level === 4) {
                    //符合条件就将改id添加到pre中，遍历结束一起返回
                    pre.push(item.id)
                } else if (item.children) {
                    // 这里用到了递归
                    this.getCheckedIds(item.children, initArr)
                }
                return pre
            }, initArr)

        },
        //保存权限
        async save() {
            try {
                //拿到选中权限的id值
                var ids = this.$refs.tree.getCheckedKeys().join(",")
                var idss = this.$refs.tree.getHalfCheckedKeys().join(",")
                var bigId = ids + ',' + idss
                //发送请求需要携带角色的id值和权限的id值
                const roleId = this.$route.params.id
                this.loading = true
                await this.$API.role.reqdoAssign(roleId, bigId)
                this.loading = false
                this.$message.success('分配权限成功')
                this.$router.replace('/role')
                this.$router.replace('/acl/role', () => {
                    console.log('replace onComplete')
                    // 跳转成功后, 判断如果更新的是当前用户对应角色的权限, 重新加载页面以获得最新的数据
                    if (roles.includes(roleName)) {
                        window.location.reload()
                    }
                })
            } catch (error) {
                console.log(error)
            }
        }
    }
}
</script>

<style>
</style>