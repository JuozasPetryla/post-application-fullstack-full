import { createLocalVue, shallowMount } from "@vue/test-utils";
import Vuex from 'vuex'
import { describe, test, expect, vi } from 'vitest'
import ErrorPage from '../views/ErrorPage.vue'


const localVue = createLocalVue()

localVue.use(Vuex)

describe('ErrorPage.vue', () => {
    let store
    let getters

    beforeEach(() => {



        store = new Vuex.Store({
            getters
        })
    })

    test('Render all of the post info', () => {
        const wrapper = shallowMount(ErrorPage, {
            localVue,
            store
        })
        expect(wrapper.find('h2').text()).toContain('Page not found')
    })


})