import { shallowMount } from '@vue/test-utils'
import { createLocalVue } from "vue-test-utils"
import Vuex from 'vuex'

const localVue = createLocalVue()

localVue.use(Vuex)

const store = new Vuex.Store({
    getters: {
        errorMessage: () => 'Page not found'
    },
    modules: {
        posts: {
            actions: {
                getPosts: vi.fn(),
                getPostDetailId: vi.fn(),
                getCurrentPost: vi.fn(),
                getAuthors: vi.fn(),
            },
            getters: {
                posts: () => [
                    {
                        title: "Naujausias article",
                        body: "naujausias tikrai",
                        authorId: 2,
                        created_at: "2023-07-19",
                        updated_at: "2023-07-19",
                        id: 1,
                    },
                    {
                        title: "NewArticleTest",
                        body: "JuozasJuozasJuozas",
                        authorId: 2,
                        created_at: "2023-07-19",
                        updated_at: "2023-07-19",
                        id: 2,
                    },
                ],
                authors: () => ["Evelyn", "Bob"],
                currentPostDetail: () => {
                    return {
                        title: "Naujausias article",
                        body: "naujausias tikrai",
                        authorId: 2,
                        created_at: "2023-07-19",
                        updated_at: "2023-07-19",
                        id: 1,
                    };
                },
                postDetailId: () => 1,
                authors: () => [
                    {
                        id: 1,
                        name: "Oliver",
                        created_at: "2023-05-31",
                        updated_at: "2023-05-31",
                    },
                    {
                        id: 2,
                        name: "Evelyn",
                        created_at: "2023-05-31",
                        updated_at: "2023-05-31",
                    },
                ],
            }
        },
        postActions: {
            actions: {
                getEditId: vi.fn(),
                getDeleteId: vi.fn(),
                createNewPost: vi.fn(),
                editPost: vi.fn(),
            },
            getters: {
                deleteId: () => 1,
            }
        },
        search: {
            actions: {
                getSearchTerm: vi.fn(),
            }
        },
        pagination: {
            actions: {
                getAllPosts: vi.fn(),
                getCurrentPage: vi.fn(),
            },
            getters: {
                pages: () => 3,
                curPage: () => 2,
            }
        },
        infoModal: {
            actions: {
                openInfoModal: vi.fn(),
            }
        },
        form: {
            state: {
                formMode: "create",
            },
            getters: {
                formMode: () => state.formMode,
                createModalIsOpen: () => false,
            },
            actions: {
                openModal: vi.fn(),
                selectFormMode: vi.fn(),
                closeModal: vi.fn(),
            }
        }
    }
})

export function isObject(item) {
    return (item && typeof item === 'object' && !Array.isArray(item))
}


export function mergeDeep(target, ...sources) {
    if (!sources.length) return target
    const source = sources.shift()

    if (isObject(target) && isObject(source)) {
        for (const key in source) {
            if (isObject(source[key])) {
                if (!target[key]) Object.assign(target, { [key]: {} })
                mergeDeep(target[key], source[key])
            } else {
                Object.assign(target, { [key]: source[key] })
            }
        }
    }

    return mergeDeep(target, ...sources)
}


function createWrapper(page, overrides) {
    const defaultMountingOptions = {
        mocks: {
            $axios: {
                get: () => {
                    return new Promise(resolve => resolve({}))
                },
                put: () => Promise.resolve({}),
                post: () => Promise.resolve({}),
            },
            $store:
            {
                store,
                localVue
            }
        },
        stubs: {},
        propsData: {},


    }
    return shallowMount(
        page,
        mergeDeep(
            defaultMountingOptions,
            overrides
        )
    )
}

export default createWrapper



// createWrapper(MyComponent, {mocks: {
//     //your mocks goes here
// }})