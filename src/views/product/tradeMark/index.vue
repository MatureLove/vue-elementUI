<template>
    <div>
        <!-- 按钮 -->
        <el-button type="primary" icon="el-icon-plus" style="margin-bottom:20px;" @click="showDialog">添加</el-button>
        <!-- 表格 
        border:纵向边框
        label:每列的标题
        width宽度
        align对齐方式
        :data展示的数据，已一列一列的进行展示
        type=index，序号从1开始展示
        prop对应列内容的字段名，
        -->
        <el-table border style="margin-bottom:20px;" :data="list">
            <el-table-column label="序号" width="100" align="center" type="index"></el-table-column>
            <el-table-column label="品牌名称" prop="tmName"></el-table-column>
            <el-table-column label="品牌LOGO">
                <template slot-scope="{row,$index}">
                    <img :src="row.logoUrl" alt="" style="width:100px;height:100px">
                </template>
            </el-table-column>
            <el-table-column label="操作">
                <template slot-scope="{row,$index}">
                    <el-button type="warning" icon="el-icon-edit" @click="updateDialog(row)">编辑</el-button>
                    <el-button type="danger" icon="el-icon-delete-solid" @click="deleteDialog(row)">删除</el-button>
                </template>
            </el-table-column>
        </el-table>
        <!-- 分页器 
        total：总页数，
        current-page：当前页
        page-size：每页展示多少条数据
        page-sizes：调正每页展示数据的条数
        layout：整体布局
        pager-count 连续页码数
        current-change 当前页点击时触发回调
        size-change每页条数改变时触发
        prev-click 用户点击上一页按钮改变当前页后触发
        next-click 用户点击下一页按钮改变当前页后触发
        -->
        <el-pagination :total="total" :current-page="page" :page-size="limit" :page-sizes="[5, 10, 15]" :pager-count="7"
            layout="prev, pager, next,jumper,->,sizes,total" style="textAlign:center;" @current-change="getTradMarkList"
            @size-change="chagePage" @prev-click="getTradMarkList" @next-click="getTradMarkList">

        </el-pagination>
        <!-- 添加  show-file-list 是否显示已上传文件列表 on-success文件上传成功时的钩子 before-upload上传文件之前的钩子-->
        <el-dialog :title="tmForm.id ? '修改品牌' : '添加品牌'" :visible.sync="dialogFormVisible">
            <el-form style="width:80%" :model="tmForm" :rules="rules" ref="ruleForm">
                <el-form-item label="品牌名称" label-width="100px" prop="tmName">
                    <el-input autocomplete="off" v-model="tmForm.tmName"></el-input>
                </el-form-item>
                <!-- action图片上传的地址 -->
                <el-form-item label="品牌LOGO" label-width="100px" prop="logoUrl">
                    <el-upload class="avatar-uploader" action="/dev-api/admin/product/fileUpload"
                        :show-file-list="false" :on-success="handleAvatarSuccess" :before-upload="beforeAvatarUpload">
                        <img v-if="tmForm.logoUrl" :src="tmForm.logoUrl" class="avatar">
                        <i v-else class="el-icon-plus avatar-uploader-icon"></i>
                        <div slot="tip" class="el-upload__tip">只能上传jpg/png文件，且不超过500kb</div>
                    </el-upload>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click="deleteTmForm">取 消</el-button>
                <el-button type="primary" @click="addOrUpdateTmform">确 定</el-button>
            </div>
        </el-dialog>
    </div>
</template>

<script>
export default {
    name: 'tradeMark',
    data() {
        return {
            page: 1, //当前页数
            limit: 5,//每页展示的条数
            list: [],//展示的数据存放的数组
            total: 0,//总共多少条数据
            dialogFormVisible: false,//是否显示
            //收集需要上传的数据
            tmForm: {
                tmName: '',
                logoUrl: ''
            },
            //表单验证规则
            rules: {
                tmName: [
                    { required: true, message: '请输入品牌名称', trigger: 'blur' },
                    { min: 2, max: 10, message: '长度在 2 到 10 个字符', trigger: 'change' }
                ],
                logoUrl: [
                    { required: true, message: '请上传图片' }
                ],
            }
        }
    },
    //组件挂载完毕发送请求拿到数据
    mounted() {
        this.getTradMarkList()
    },
    methods: {
        //封装一个发送请求的方法
        async getTradMarkList(pager = 1) {
            this.page = pager
            const { page, limit } = this
            // console.log(this.$API)
            let result = await this.$API.tradeMark.reqGettradeMark(page, limit)
            if (result.code === 200) {
                this.list = result.data.records
                this.total = result.data.total
            }
        },
        //每页条数改变时触发
        chagePage(limit) {
            this.limit = limit
            this.getTradMarkList()
        },
        //文件上传成功时的钩子
        handleAvatarSuccess(res, file) {
            // console.log(res)
            this.tmForm.logoUrl = res.data
        },
        //before-upload上传文件之前的钩子
        beforeAvatarUpload(file) {
            const isJPG = file.type === 'image/jpeg';
            const isLt2M = file.size / 1024 / 1024 < 2;

            if (!isJPG) {
                this.$message.error('上传头像图片只能是 JPG 格式!');
            }
            if (!isLt2M) {
                this.$message.error('上传头像图片大小不能超过 2MB!');
            }
            return isJPG && isLt2M;
        },
        //点击添加的回调
        showDialog() {
            //让添加框显示
            this.dialogFormVisible = true
        },
        //编辑按钮的回调
        updateDialog(row) {
            //让添加框显示
            this.dialogFormVisible = true
            //row当前选中这个品牌的品牌信息
            //将品牌的信息结构赋值给tmform
            this.tmForm = { ...row }
        },
        //点击取消按钮的回调
        deleteTmForm() {
            this.dialogFormVisible = false
            this.tmForm.tmName = ''
            this.tmForm.logoUrl = ''
        },
        //点击确定按钮的回调
        addOrUpdateTmform() {
            this.$refs.ruleForm.validate(async (success) => {
                if (success) {
                    this.dialogFormVisible = false //将对话框隐藏
                    // console.log(this.tmForm)
                    let result = await this.$API.tradeMark.reqAddOrUpdateTradMark(this.tmForm)
                    if (result.code === 200) {
                        //添加成果或者修改成功进行弹框提示
                        this.$message({ message: this.tmForm.id ? '修改品牌数据成功' : '添加品牌数据成功', type: 'success' })
                        //重新发送请求获取数据
                        this.getTradMarkList(this.tmForm.id ? this.page : 1)
                    } else {
                        //添加成果或者修改成功进行弹框提示
                        this.$message.error(this.tmForm.id ? '修改品牌数据失败' : '添加品牌数据失败')
                    }
                } else {
                    this.$message.error('请输入对应的内容！')
                    return false;
                }
            });
        },
        //删除商品
        deleteDialog(row) {
            this.$confirm(`此操作将永久删除${row.tmName}, 是否继续?`, '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(async () => {
                let result = await this.$API.tradeMark.reqDeleteTradMark(row.id)
                if (result.code === 200) {
                    this.$message({
                        type: 'success',
                        message: '删除成功!'
                    });
                    this.getTradMarkList(this.list.length > 1 ? this.page : this.page - 1)
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


<style scoped>
.avatar-uploader .el-upload {
    border: 1px dashed #d9d9d9;
    border-radius: 6px;
    cursor: pointer;
    position: relative;
    overflow: hidden;
}

.avatar-uploader .el-upload:hover {
    border-color: #409EFF;
}

.avatar-uploader-icon {
    font-size: 28px;
    color: #8c939d;
    width: 178px;
    height: 178px;
    line-height: 178px;
    text-align: center;
}

.avatar {
    width: 178px;
    height: 178px;
    display: block;
}
</style>