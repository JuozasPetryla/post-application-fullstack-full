const state = {
    authorEditId: 0,
    authorDeleteId: 0,
}

const mutations = {
    setAuthorEditId: (state, authorEditId) => state.authorEditId = authorEditId,
    setAuthorDeleteId: (state, authorDeleteId) => state.authorDeleteId = authorDeleteId,
}
const getters = {
    authorEditId: state => state.authorEditId,
    authorDeleteId: state => state.authorDeleteId,
}
const actions = {
    async editAuthor({ commit }, authorEditedObj) {
        try {
            const editedAuthor = await this.editAuthor(authorEditedObj)
            commit('setInfoModalText', 'Author edited succesfully!')
            commit('setInfoModalTitle', 'Success')
            commit('setInfoModalOpen')
        } catch (err) {
            commit('setInfoModalText', err.message)
            commit('setInfoModalTitle', 'An error has occured')
            commit('setInfoModalMode', 'error')
            commit('setInfoModalOpen')
        }
    },
    async deleteAuthor({ commit }, authorDeleteId) {
        try {
            const deletedAuthor = await this.deleteAuthor(authorDeleteId)
            commit('setTotalAuthors')
        } catch (err) {
            commit('setInfoModalText', err.message)
            commit('setInfoModalTitle', 'An error has occured')
            commit('setInfoModalMode', 'error')
            commit('setInfoModalOpen')
        }
    },
    async createNewAuthor({ commit }, authorObj) {
        try {
            const newAuthor = await this.createNewAuthor(authorObj)
            commit('setTotalAuthors')
            commit('setNewAuthor', newAuthor, { root: true })
            commit('setInfoModalText', 'Author created succesfully!')
            commit('setInfoModalTitle', 'Success')
            commit('setInfoModalOpen')
        } catch (err) {
            commit('setInfoModalText', err.message)
            commit('setInfoModalTitle', 'An error has occured')
            commit('setInfoModalMode', 'error')
            commit('setInfoModalOpen')
        }
    },
    getAuthorEditId({ commit }, authorEditId) {
        commit('setAuthorEditId', authorEditId)
    },
    getAuthorDeleteId({ commit }, authorDeleteId) {
        commit('setAuthorDeleteId', authorDeleteId)
    },


}
export default {
    state,
    mutations,
    getters,
    actions
}