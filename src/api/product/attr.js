//引入封装的api
import request from '@/utils/request'
//获取一级分类列表 GET /admin/product/getCategory1
export const reqGetCategory1 = () => request({
    url: `/admin/product/getCategory1`,
    method: 'get'
})
//获取二级分类 /admin/product/getCategory2/{category1Id}
export const reqGetCategory2 = (category1Id) => request({
    url: `/admin/product/getCategory2/${category1Id}`,
    method: 'get'
})
//获取三级分类 /admin/product/getCategory3/{category2Id}
export const reqGetCategory3 = (category2Id) => request({
    url: `/admin/product/getCategory3/${category2Id}`,
    method: 'get'
})

//获取商品列表 /admin/product/attrInfoList/{category1Id}/{category2Id}/{category3Id} get
export const reqAttrInfoList = (category1Id, category2Id, category3Id) => request({
    url: `/admin/product/attrInfoList/${category1Id}/${category2Id}/${category3Id}`,
    method: 'get'
})
//添加属性  POST /admin/product/saveAttrInfo
// {
//     "attrName": "string",  属性名
//     "attrValueList": [   属性值
//       {
//         "attrId": 0,  属性id
//         "valueName": "string"
//       }
//     ],
//     "categoryId": 0,  三级列表id
//     "categoryLevel": 0,  3
//   }
export const reqAddOrUpdateAttrInfo = (data) => request({
    url: `/admin/product/saveAttrInfo`,
    method: `post`,
    data
})
//删除属性 DELETE /admin/product/deleteAttr/{attrId}
export const reqDeleteAttr = (attrId) => request({
    url: `/admin/product/deleteAttr/${attrId}`,
    method: 'delete'
})