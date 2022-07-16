//引入封装的api
import request from '@/utils/request'

//  get /admin/product / { page } / { limit } 获取spu数据
export const reqProduct = (page, limit, category3Id) => request({
    url: `/admin/product/${page}/${limit}`,
    method: 'get',
    params: { category3Id }
})

//获取某一个SPU信息  /admin/product/getSpuById/{spuId}  get
export const reqGetSpuInfo = (spuId) => request({
    url: `/admin/product/getSpuById/${spuId}`,
    method: 'get'
})
//获取品牌的数据 GET /admin/product/baseTrademark/getTrademarkList
export const reqTmList = () => request({
    url: `/admin/product/baseTrademark/getTrademarkList`,
    method: 'get'
})
//获取平台中全部的销售属性（3个）/admin/product/baseSaleAttrList get
export const reqBaseSaleAttrList = () => request({
    url: `/admin/product/baseSaleAttrList`,
    method: 'get'
})
//获取SPU图片  /admin/product/spuImageList/{spuId} get
export const reqSpuImageList = (spuId) => request({
    url: `/admin/product/spuImageList/${spuId}`,
    method: 'get'
})

//保存和修改数据
export const reqSaveOrUpdateSpuInfo = (supInfo) => {
    //携带的参数有id表示为修改数据
    if (supInfo.id) {
        return request({
            url: `/admin/product/updateSpuInfo`,
            method: 'post',
            data: supInfo
        })
    } else { //没有id时添加数据
        return request({
            url: `/admin/product/saveSpuInfo`,
            method: 'post',
            data: supInfo
        })
    }
}

//删除spu
export const reqDeleteSpu = (spuId) => request({
    url: `/admin/product/deleteSpu/${spuId}`,
    method: 'delete'
})