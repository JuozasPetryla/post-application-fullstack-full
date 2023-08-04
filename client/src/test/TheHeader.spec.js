import { describe, test, expect, vi } from 'vitest'
import TheHeader from '../components/layout/TheHeader.vue'
import createWrapper from './mockFactory'


describe('TheHeader.vue', () => {
    let wrapper

    beforeEach(() => {

        wrapper = createWrapper(TheHeader)
    })


    test('Header "new article" button should open modal window and set mode to create', async () => {
        await wrapper.find('button').trigger('click')
        expect(wrapper.vm.$store.modules.form.actions.openModal).toHaveBeenCalled()
        expect(actions.selectFormMode).toHaveBeenCalled()
    })

})
