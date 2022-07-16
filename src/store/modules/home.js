import mockRequest from '@/utils/mockRequest'

export default {
    actions: {
        async getDateList({ commit }) {
            try {
                //发请求获取首页模拟数据
                let result = await mockRequest({
                    url: `/home/list`
                })
                // console.log(result)
                commit('GETDATELIST', result.data)
            } catch (error) {
                console.log(error)
            }

        }
    },
    mutations: {
        GETDATELIST(state, datalist) {
            state.datalist = datalist
        }
    },
    state: {
        datalist: {}
    },
    getters: {

    }
}