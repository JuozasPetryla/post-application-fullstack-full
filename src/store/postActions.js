const state = {
    editId: 0,
    deleteId: 0,
}

const mutations = {
    setEditId: (state, editId) => state.editId = editId,
    setDeleteId: (state, deleteId) => state.deleteId = deleteId,

}
const getters = {
    editId: state => state.editId,
    deleteId: state => state.deleteId,
}
const actions = {
    async editPost({ commit }, postEditedObj) {
        try {
            const editedPost = await this.editPost(postEditedObj)
            commit('setInfoModalText', 'Post edited succesfully!')
            commit('setInfoModalTitle', 'Success')
            commit('setInfoModalOpen')
        } catch (err) {
            commit('setInfoModalText', err.message)
            commit('setInfoModalTitle', 'An error has occured')
            commit('setInfoModalMode', 'error')
            commit('setInfoModalOpen')
        }
    },
    async deletePost({ commit }, postDeleteId) {
        try {
            const deletedPost = await this.deletePost(postDeleteId)
            commit('setTotalPosts')
        } catch (err) {
            commit('setInfoModalText', err.message)
            commit('setInfoModalTitle', 'An error has occured')
            commit('setInfoModalMode', 'error')
            commit('setInfoModalOpen')
        }
    },
    async createNewPost({ commit }, postObj) {
        try {
            const newPost = await this.createNewPost(postObj)
            commit('setTotalPosts')
            commit('setNewPost', newPost, { root: true })
            commit('setInfoModalText', 'Post created succesfully!')
            commit('setInfoModalTitle', 'Success')
            commit('setInfoModalOpen')
        } catch (err) {
            commit('setInfoModalText', err.message)
            commit('setInfoModalTitle', 'An error has occured')
            commit('setInfoModalMode', 'error')
            commit('setInfoModalOpen')
        }
    },
    getEditId({ commit }, editId) {
        commit('setEditId', editId)
    },
    getDeleteId({ commit }, deleteId) {
        commit('setDeleteId', deleteId)
    },


}
export default {
    state,
    mutations,
    getters,
    actions
}