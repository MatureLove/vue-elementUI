import request from '@/utils/request'

//获取分页列表数据 /admin/acl/role/{page}/{limit}
export const reqRoleList = (page, limit, searchObj) => request({
    url: `/admin/acl/role/${page}/${limit}`,
    method: 'get',
    params: searchObj
})
//添加角色/admin/acl/role/save post
export const reqAddRole = (data) => request({
    url: `/admin/acl/role/save`,
    method: 'post',
    data
})
//批量删除 DELETE /admin/acl/role/batchRemove
export const reqBatchRemove = (idList) => request({
    url: '/admin/acl/role/batchRemove',
    method: 'delete',
    data: idList
})
//修改角色名称 PUT /admin/acl/role/update
export const reqUpdate = (data) => request({
    url: '/admin/acl/role/update',
    method: 'put',
    data
})
//删除角色名称 DELETE /admin/acl/role/remove/{id}
export const reqDelete = (id) => request({
    url: `/admin/acl/role/remove/${id}`,
    method: 'delete'
})

//获取指定角色的权限列表  /admin/acl/permission/toAssign/{roleId}  get
export const reqtoAssign = (roleId) => request({
    url: `/admin/acl/permission/toAssign/${roleId}`,
    method: 'get'
})

//给某个角色分配权限 POST /admin/acl/permission/doAssign
export const reqdoAssign = (roleId, permissionId) => request({
    url: `/admin/acl/permission/doAssign`,
    method: 'post',
    params: {
        roleId,
        permissionId
    }
})