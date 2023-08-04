import Vuex from "vuex";
import Vue from "vue";

import posts from "./posts";
import authors from "./authors";
import pagination from "./pagination";
import search from "./search";
import postActions from "./postActions";
import authorActions from "./authorActions";
import infoModal from "./infoModal";
import form from "./form";
import notification from "./notification";
import postsAPI from "../plugins/postsAPI";
import authorsAPI from "../plugins/authorsAPI";
import createWebSocketPlugin from "../plugins/socketIo";


Vue.use(Vuex);

const store = new Vuex.Store({
    plugins: [

        createWebSocketPlugin()
    ],
    state: {
        errorMessage: ''
    },
    mutations: {
        setErrorMessage: (state, errorMessage) => state.errorMessage = errorMessage
    },
    getters: {
        errorMessage: state => state.errorMessage
    },
    modules: {
        posts,
        pagination,
        search,
        postActions,
        infoModal,
        notification,
        form,
        notification,
        authors,
        authorActions
    }
})

postsAPI(store)
authorsAPI(store)

export default store;
