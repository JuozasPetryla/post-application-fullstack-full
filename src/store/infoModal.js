const state = {
    infoModalIsOpen: false,
    infoModalText: '',
    infoModalTitle: '',
    infoModalMode: '',
}

const mutations = {
    setInfoModalOpen: (state) => state.infoModalIsOpen = true,
    setInfoModalClosed: (state) => state.infoModalIsOpen = false,
    setInfoModalText: (state, infoModalText) => state.infoModalText = infoModalText,
    setInfoModalTitle: (state, infoModalTitle) => state.infoModalTitle = infoModalTitle,
    setInfoModalMode: (state, infoModalMode) => state.infoModalMode = infoModalMode,
}
const getters = {
    infoModalIsOpen: state => state.infoModalIsOpen,
    infoModalText: state => state.infoModalText,
    infoModalTitle: state => state.infoModalTitle,
    infoModalMode: state => state.infoModalMode,
}
const actions = {
    openInfoModalPost({ commit }) {
        commit('setInfoModalText', 'Are you sure you want to delete this post?')
        commit('setInfoModalTitle', 'Delete post')
        commit('setInfoModalMode', 'deletePost')
        commit('setInfoModalOpen')
    },
    openInfoModalAuthor({ commit }) {
        commit('setInfoModalText', 'Are you sure you want to delete this author?')
        commit('setInfoModalTitle', 'Delete author')
        commit('setInfoModalMode', 'deleteAuthor')
        commit('setInfoModalOpen')
    },
    closeInfoModal({ commit }) {
        commit('setInfoModalClosed')
    },
}

export default {
    state,
    mutations,
    getters,
    actions
}