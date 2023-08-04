import router from "../router/router";

const state = {
    authors: [],
    authorsWithPosts: [],
    authorDetailId: 0,
    currentAuthorDetail: {},
    currentAuthorDetailWithPosts: {},
    totalAuthors: 0
}

const mutations = {
    setAuthors: (state, gotAuthors) => state.authors = gotAuthors,
    setAuthorsWithPosts: (state, gotAuthorsWithPosts) => state.authorsWithPosts = gotAuthorsWithPosts,
    setAuthorDetailId: (state, authorId) => state.authorDetailId = authorId,
    setCurrentAuthorDetail: (state, currentAuthor) => state.currentAuthorDetail = currentAuthor,
    setCurrentAuthorDetailWithPosts: (state, currentAuthorWithPosts) => state.currentAuthorDetailWithPosts = currentAuthorWithPosts,
    setNewAuthor: (state, authorObj) => state.authors.unshift(authorObj),
    setTotalAuthors: (state, authorNum) => state.totalAuthors = authorNum,
}
const getters = {
    authors: (state) => state.authors,
    authorsWithPosts: (state) => state.authorsWithPosts,
    authorDetailId: state => state.authorDetailId,
    currentAuthorDetail: state => state.currentAuthorDetail,
    currentAuthorDetailWithPosts: state => state.currentAuthorDetailWithPosts,
    totalAuthors: state => state.totalAuthors,
}
const actions = {
    async getAuthors({ commit, _, rootState }) {
        try {
            const authors = await this.getAuthors(rootState.pagination.currentPage)
            if (authors.response) {
                throw new Error(authors.response.statusText)
            }
            commit('setTotalAuthors', authors.totalAuthors)
            commit('setPages', authors.totalPages, { root: true })
            commit('setCurrentPage', authors.currentPage, { root: true })
            commit('setAuthors', authors.authors)
        } catch (err) {
            commit('setTotalAuthors', 0)
        }
    },
    async getAuthorsWithPosts({ commit, _, rootState }) {
        try {
            const authors = await this.getAuthorsWithPosts(rootState.pagination.currentPage)
            if (authors.response) {
                throw new Error(authors.response.statusText)
            }
            commit('setTotalAuthors', authors.totalAuthors)
            commit('setPages', authors.totalPages, { root: true })
            commit('setCurrentPage', authors.currentPage, { root: true })
            commit('setAuthorsWithPosts', authors.authors)
        } catch (err) {
            commit('setTotalAuthors', 0)
        }
    },
    async getCurrentAuthor({ commit }, authorId) {
        const authorCurrentId = authorId ? authorId : router.currentRoute.params.id
        try {
            const currentAuthor = await this.getCurrentAuthor(authorCurrentId)
            commit('setCurrentAuthorDetail', currentAuthor)
        } catch (err) {
            commit('setErrorMessage', err.message, { root: true })
            router.push({ name: 'error' })
        }
    },
    async getCurrentAuthorWithPosts({ commit }, authorId) {
        const authorCurrentId = authorId ? authorId : router.currentRoute.params.id
        try {
            const currentAuthor = await this.getCurrentAuthorWithPosts(authorCurrentId)
            commit('setCurrentAuthorDetailWithPosts', currentAuthor)
        } catch (err) {
            commit('setErrorMessage', err.message, { root: true })
            router.push({ name: 'error' })
        }
    },
    getAuthorDetailId({ commit }, authorId) {
        commit('setAuthorDetailId', authorId)
    },
}

export default {
    state,
    mutations,
    getters,
    actions
}

