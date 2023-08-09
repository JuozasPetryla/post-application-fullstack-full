import router from "../router/router";

const state = {
    posts: [],
    postsWithAuthors: [],
    postDetailId: 0,
    currentPostDetail: {},
    currentPostDetailWithAuthor: {},
    totalPosts: 0
}

const mutations = {
    setPosts: (state, gotPosts) => state.posts = gotPosts,
    setPostsWithAuthors: (state, gotPostsWithAuthors) =>
        state.postsWithAuthors = gotPostsWithAuthors,
    setPostDetailId: (state, postId) => state.postDetailId = postId,
    setCurrentPostDetail: (state, currentPost) => state.currentPostDetail = currentPost,
    setCurrentPostDetailWithAuthor: (state, currentPostWithAuthor) => state.currentPostDetailWithAuthor = currentPostWithAuthor,
    setNewPost: (state, postObj) => state.posts.unshift(postObj),
    setTotalPosts: (state, postNum) => state.totalPosts = postNum,
}
const getters = {
    posts: (state) => state.posts,
    postsWithAuthors: (state) => state.postsWithAuthors,
    postDetailId: state => state.postDetailId,
    currentPostDetail: state => state.currentPostDetail,
    currentPostDetailWithAuthor: state => state.currentPostDetailWithAuthor,
    totalPosts: state => state.totalPosts,
}
const actions = {

    async getPosts({ commit, _, rootState }) {
        try {
            const posts = await this.getPosts(rootState.pagination.currentPage)
            if (posts.response) {
                throw new Error(posts.response.statusText)
            }
            commit('setTotalPosts', posts.totalPost)
            commit('setPages', posts.totalPages, { root: true })
            commit('setCurrentPage', posts.currentPage, { root: true })
            commit('setPosts', posts.posts)
        } catch (err) {

            commit('setTotalPosts', 0)
        }
    },
    async getPostsWithAuthors({ commit, _, rootState }) {
        try {
            const posts = await this.getPostsWithAuthors(rootState.pagination.currentPage)
            if (posts.response) {
                throw new Error(posts.response.statusText)
            }
            commit('setTotalPosts', posts.totalPosts)
            commit('setPages', posts.totalPages, { root: true })
            commit('setCurrentPage', posts.currentPage, { root: true })
            commit('setPostsWithAuthors', posts.posts)
        } catch (err) {
            commit('setTotalPosts', 0)
        }
    },
    async getCurrentPost({ commit }, postId) {
        const postCurrentId = postId ? postId : router.currentRoute.params.id
        try {
            const currentPosts = await this.getCurrentPost(postCurrentId)
            commit('setCurrentPostDetail', currentPosts)
        } catch (err) {
            commit('setErrorMessage', err.message, { root: true })
            router.push({ name: 'error' })
        }
    },
    async getCurrentPostWithAuthor({ commit }, postId) {
        const postCurrentId = postId ? postId : router.currentRoute.params.id
        try {
            const currentPosts = await this.getCurrentPostWithAuthor(postCurrentId)
            commit('setCurrentPostDetailWithAuthor', currentPosts)
        } catch (err) {
            commit('setErrorMessage', err.message, { root: true })
            router.push({ name: 'error' })
        }
    },
    getPostDetailId({ commit }, postId) {
        commit('setPostDetailId', postId)
    },
}

export default {
    state,
    mutations,
    getters,
    actions
}

