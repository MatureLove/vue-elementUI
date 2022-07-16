//引入封装的api
import request from '@/utils/request'

//获取图片信息 /admin/product/spuImageList/{spuId}
export const reqSpuImageList = (spuId) => request({
    url: `/admin/product/spuImageList/${spuId}`,
    method: 'get'
})

//获取销售属性  /admin/product/spuSaleAttrList/{spuId}
export const reqSpuSaleAttrList = (spuId) => request({
    url: `/admin/product/spuSaleAttrList/${spuId}`,
    method: 'get'
})
//获取平台属性 GET /admin/product/attrInfoList/{category1Id}/{category2Id}/{category3Id}
export const reqAttrInfoList = (category1Id, category2Id, category3Id) => request({
    url: `/admin/product/attrInfoList/${category1Id}/${category2Id}/${category3Id}`,
    method: 'get'
})

//保存 POST /admin/product/saveSkuInfo
export const reqSaveSkuInfo = (skuInfo) => request({
    url: `/admin/product/saveSkuInfo`,
    method: 'post',
    data: skuInfo
})

//获取sku列表 GET /admin/product/findBySpuId/{spuId}
export const reqFindBySpuId = (spuId) => request({
    url: `/admin/product/findBySpuId/${spuId}`,
    method: 'get'
})

// sku模块

//获取数据  GET /admin/product/list/{page}/{limit}
export const reqList = (page, limit) => request({
    url: `/admin/product/list/${page}/${limit}`,
    method: 'get'
})

//上架  GET /admin/product/onSale/{skuId}
export const reqOnSale = (skuId) => request({
    url: `/admin/product/onSale/${skuId}`,
    method: 'get'
})
//下架 /admin/product/cancelSale/{skuId}
export const reqCancelSale = (skuId) => request({
    url: `/admin/product/cancelSale/${skuId}`,
    method: 'get'
})
//查看详细  /admin/product/getSkuById/{skuId} get
export const reqGetSkuById = (skuId) => request({
    url: `/admin/product/getSkuById/${skuId}`,
    method: 'get'
})