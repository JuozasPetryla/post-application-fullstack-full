import createWrapper from './mockFactory'
import { describe, test, expect } from 'vitest'
import BaseCard from '../components/UI/BaseCard.vue'


describe("BaseCard.vue", () => {

    let wrapper

    beforeEach(() => {
        wrapper = createWrapper(BaseCard, {
            slots: {
                default: 'Base card content'
            }
        })
    })
    test('Base card default slot', () => {
        expect(wrapper.html()).toContain('Base card content')
    })
    test('Emits a click event when clicked', () => {
        wrapper.find('div').trigger('click')
        expect(wrapper.emitted()).toHaveProperty('click')
    })
})
