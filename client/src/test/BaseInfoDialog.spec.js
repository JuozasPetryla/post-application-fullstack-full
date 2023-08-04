import createWrapper from './mockFactory'
import { describe, test, expect } from 'vitest'
import BaseInfoDialog from '../components/UI/BaseInfoDialog.vue'


describe("BaseInfoDialog.vue", () => {

    let wrapper

    beforeEach(() => {
        wrapper = createWrapper(BaseInfoDialog, {
            slots: {
                title: 'Base info dialog title text',
                information: 'Base info dialog information text',
                actions: 'Base info dialog actions section',
            }
        })
    })

    test('Base info dialog slots', () => {
        expect(wrapper.html()).toContain('Base info dialog title text')
        expect(wrapper.html()).toContain('Base info dialog information text')
        expect(wrapper.html()).toContain('Base info dialog actions section')
    })
})