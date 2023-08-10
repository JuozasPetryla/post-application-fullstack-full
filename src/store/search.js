import router from "../router/router"
const state = {
    searchTerm: '',
    searchedPosts: [],
    searchedPostsWithAuthors: [],
}
const mutations = {
    setSearchTerm: (state, searchTerm) => state.searchTerm = searchTerm,
    setSearchedPosts: (state, searchedPosts) => state.searchedPosts = searchedPosts,
    setSearchedPostsWithAuthors: (state, searchedPostsWithAuthors) => state.searchedPostsWithAuthors = searchedPostsWithAuthors
}
const getters = {
    searchTerm: state => state.searchTerm,
    searchedPosts: (state) => state.searchedPosts,
    searchedPostsWithAuthors: (state) => state.searchedPostsWithAuthors

}
const actions = {
    async getSearchedPosts({ commit, state, rootState }) {
        try {
            const searchedPosts = await this.getSearchedPosts(state.searchTerm, rootState.pagination.currentPage)
            commit('setCurrentPage', searchedPosts.currentPage, { root: true })
            commit('setPages', searchedPosts.totalPages, { root: true })
            commit('setSearchedPosts', searchedPosts.posts)
        } catch (err) {
            commit('setErrorMessage', err.message, { root: true })
            router.push({ name: 'error' })
        }
    },
    async getSearchedPostsWithAuthors({ commit, state, rootState }) {
        try {
            const searchedPosts = await this.getSearchedPostsWithAuthors(state.searchTerm, rootState.pagination.currentPage)
            commit('setCurrentPage', searchedPosts.currentPage, { root: true })
            commit('setPages', searchedPosts.totalPages, { root: true })
            commit('setSearchedPostsWithAuthors', searchedPosts.posts)
        } catch (err) {
            commit('setErrorMessage', err.message, { root: true })
            router.push({ name: 'error' })
        }
    },
    getSearchTerm({ commit }, searchTerm) {
        commit('setSearchTerm', searchTerm)
    },
}

export default {
    state,
    mutations,
    getters,
    actions
}