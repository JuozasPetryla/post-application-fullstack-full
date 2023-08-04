const state = {
    pages: 1,
    currentPage: 1,
}

const mutations = {
    setPages: (state, pages) => state.pages = state.pages = pages,
    setCurrentPage: (state, curPage) => state.currentPage = curPage,
}
const getters = {
    pages: state => state.pages,
    curPage: state => state.currentPage,
    postsLength: state => state.postsLength

}
const actions = {
    getCurrentPage({ commit }, curPage) {
        commit('setCurrentPage', curPage)
    },
    getPages({ commit }) {
        commit('setPages')
    },
}

export default {
    state,
    mutations,
    getters,
    actions
}