import * as attr from './product/attr'
import * as sku from './product/sku'
import * as spu from './product/spu'
import * as tradeMark from './product/tradeMark'
import * as permission from './acl/permission'
import * as role from './acl/role'
import * as user from './acl/user'
//四个接口统一对外暴露
export default {
    attr,
    sku,
    spu,
    tradeMark,
    permission,
    role,
    user
}