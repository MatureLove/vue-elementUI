import request from '@/utils/request'
//获取菜单  get /admin/acl/permission
export const reqPermission = () => request({
    url: '/admin/acl/permission',
    method: 'get'
})

//添加菜单（功能） /admin/acl/permission/save post
export const reqAddMeny = (data) => request({
    url: '/admin/acl/permission/save',
    method: 'post',
    data
})
//修改菜单  /admin/acl/permission/update  put
export const reqUpdateMeny = (data) => request({
    url: '/admin/acl/permission/update',
    method: 'put',
    data
})

//删除菜单 /admin/acl/permission/remove/{id} delete
export const reqDeleteMeny = (id) => request({
    url: `/admin/acl/permission/remove/${id}`,
    method: 'delete'
})