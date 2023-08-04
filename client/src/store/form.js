import router from "../router/router"

const state = {
    createModalIsOpen: false,
    formMode: '',
    modalButton: '',
}

const mutations = {
    setModalOpen: (state) => state.createModalIsOpen = true,
    setModalClosed: (state) => state.createModalIsOpen = false,
    setFormMode: (state, mode) => state.formMode = mode,
    setModalButton: (state, mode) => state.ModalButton = mode,
}
const getters = {
    createModalIsOpen: state => state.createModalIsOpen,
    formMode: state => state.formMode,
    modalButton: state => state.modalButton
}
const actions = {
    openModal({ commit }) {
        commit('setModalOpen')
    },
    closeModal({ commit }) {
        commit('setModalClosed')
    },
    selectFormMode({ commit }, mode) {
        commit('setFormMode', mode)
    },
    getModalButton({ commit }) {
        const modeRoute = router.currentRoute.path === '/' ? 'article' : 'author'
        const mode = 'New ' + modeRoute
        commit('setModalButton', mode)
    },
}

export default {
    state,
    mutations,
    getters,
    actions
}