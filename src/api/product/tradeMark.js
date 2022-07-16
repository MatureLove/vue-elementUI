//引入封装的axios
import request from '@/utils/request'
//获取品牌管理数据 GET /admin/product/baseTrademark/{page}/{limit} 
export const reqGettradeMark = (page, limit) => request({
    url: `/admin/product/baseTrademark/${page}/${limit}`,
    method: 'get'
})

//添加和修改品牌数据
//添加 /admin/product/baseTrademark/save post 修改/admin/product/baseTrademark/update put
export const reqAddOrUpdateTradMark = (tmForm) => {
    if (tmForm.id) {
        return request({
            url: `/admin/product/baseTrademark/update`,
            method: 'put',
            data: tmForm
        })
    } else {
        return request({
            url: '/admin/product/baseTrademark/save',
            method: 'post',
            data: tmForm

        })
    }
}

//删除品牌信息 DELETE /admin/product/baseTrademark/remove/{id}
export const reqDeleteTradMark = (id) => request({
    url: `/admin/product/baseTrademark/remove/${id}`,
    method: 'delete'
})