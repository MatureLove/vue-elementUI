//引入封装的api
import request from '@/utils/request'

///admin/acl/user/{page}/{limit}  获取用户分页列表
export const reqGetAclUserList = (page, limit, searchObj) => request({
    url: `admin/acl/user/${page}/${limit}`,
    method: 'get',
    params: searchObj
})

///admin/acl/user/save 新增管理用户 post
export const reqAddUser = (data) => request({
    url: `admin/acl/user/save`,
    method: 'post',
    data
})
//批量删除 /admin/acl/user/batchRemove delete
export const reqBatchRemove = (data) => request({
    url: '/admin/acl/user/batchRemove',
    method: 'delete',
    data
})

//根据用户获取角色数据 GET /admin/acl/user/toAssign/{userId}
export const reqGetToAssign = (userId) => request({
    url: `/admin/acl/user/toAssign/${userId}`,
    method: 'get'
})

//给用户添加角色数据 POST /admin/acl/user/doAssign
export const reqDoAssign = (userId, roleId) => request({
    url: '/admin/acl/user/doAssign',
    method: 'post',
    params: {
        userId,
        roleId
    }
})
//获取管理用户信息 GET /admin/acl/user/get/{id}
export const reqGetuser = (id) => request({
    url: `/admin/acl/user/get/${id}`,
    method: 'get'
})
//修改管理用户 /admin/acl/user/update put
export const reqUpdateUser = (user) => request({
    url: `/admin/acl/user/update`,
    method: 'put',
    data: user
})
//删除用户/admin/acl/user/remove/{id} delete
export const removeUser = (id) => request({
    url: `/admin/acl/user/remove/${id}`,
    method: 'delete'
})