const state = {
    notificationOpen: false,
    notificationText: ''
}

const mutations = {
    setNotificationOpen: (state) => state.notificationOpen = true,
    setNotificationClosed: (state) => state.notificationOpen = false,
    setNotificationText: (state, notifText) => state.notificationText = notifText
}
const getters = {
    notificationOpen: state => state.notificationOpen,
    notificationText: state => state.notificationText,
}
const actions = {
    getNotificationText({ commit }, notifText) {
        commit('setNotificationText', notifText)
    },
    openNotification({ commit }) {
        commit('setNotificationOpen')
    },
    closeNotification({ commit }) {
        commit('setNotificationClosed')
    },
}

export default {
    state,
    mutations,
    getters,
    actions
}