import createWrapper from './mockFactory'
import { describe, test, expect } from 'vitest'
import BaseButton from '../components/UI/BaseButton.vue'

describe("BaseButton.vue", () => {
    let wrapper

    beforeEach(() => {
        wrapper = createWrapper(BaseButton, {
            slots: {
                default: 'Base button content'
            }
        })
    })

    test('Base button default slot', () => {
        expect(wrapper.html()).toContain('Base button content')
    })
    test('Emits a click event when clicked', () => {
        wrapper.find('button').trigger('click')
        expect(wrapper.emitted()).toHaveProperty('click')
    })
})