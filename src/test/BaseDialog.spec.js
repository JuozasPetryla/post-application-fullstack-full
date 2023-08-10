import Vuex from "vuex";
import { createLocalVue, shallowMount } from "@vue/test-utils";
import { describe, expect, test } from "vitest";
import BaseDialog from "../components/UI/BaseDialog.vue";

const localVue = createLocalVue();

localVue.use(Vuex);

describe("BaseDialog.vue", () => {
    let store;
    let state;
    let actions;
    let getters;
    let wrapper;
    let mockRouter;

    beforeEach(() => {

        actions = {

        };

        store = new Vuex.Store({
            modules: {
                form: {
                    state,
                    actions,
                    getters,
                },
                posts: {
                    getters,
                },
                postActions: {
                    actions,
                    getters,
                },
            },
        });

        mockRouter = {
            push: vi.fn(),
            currentRoute: { path: "/postDetail/1" },
        };

        wrapper = shallowMount(BaseDialog, {
            localVue,
            store,
            slots: {
                header: "Header content",
                button: "Button content",
            },
            mocks: {
                $router: mockRouter,
            },
        });
    });

    test("Renders slots correctly", () => {
        expect(wrapper.html()).toContain("Header content");
        expect(wrapper.html()).toContain("Button content");
    });

    test('shows the author select element when formMode is "create"', () => {
        const authorSelect = wrapper.find("select#author");
        expect(authorSelect.exists()).toBe(true);
    });

    it("validates the title, author and content field correctly", async () => {
        await wrapper.find("#title").setValue("");
        expect(wrapper.vm.titleIsValid).toBe(false);

        await wrapper.find("#title").setValue("Test Title");
        expect(wrapper.vm.titleIsValid).toBe(true);

        await wrapper.find("textarea").setValue("Test content");
        expect(wrapper.vm.contentIsValid).toBe(true);

        await wrapper
            .find(".select-options")
            .findAll("option")
            .at(0)
            .setSelected({});
        expect(wrapper.vm.authorIsValid).toBe(true);

        await wrapper
            .find(".select-options")
            .findAll("option")
            .at(0)
            .setSelected({ name: "Evelyn", id: 1 });
        expect(wrapper.vm.authorIsValid).toBe(true);
    });

    test("triggers 'closeModal' action when the Close Modal button is clicked", async () => {
        await wrapper.find(".close-btn").trigger("click");
        expect(actions.closeModal).toHaveBeenCalled();
    });

    test("validates the title field", async () => {
        const titleInput = wrapper.find("#title");
        const contentTextarea = wrapper.find("#content");
        const authorSelect = wrapper.find("#author");

        await titleInput.setValue("");
        await titleInput.trigger("blur");
        expect(wrapper.vm.titleIsValid).toBe(false);

        await contentTextarea.setValue("");
        await contentTextarea.trigger("blur");
        expect(wrapper.vm.contentIsValid).toBe(false);

        await authorSelect
            .find(".select-options")
            .findAll("option")
            .at(0)
            .setSelected({});
        await authorSelect.trigger("focusout");
        expect(wrapper.vm.authorIsValid).toBe(false);
    });

    test("submits the form in create mode when all fields are valid", async () => {
        wrapper.vm.formIsValid = true;
        const titleInput = wrapper.find("#title");
        const contentTextarea = wrapper.find("#content");
        const authorSelect = wrapper.find("select");
        await titleInput.setValue("Title");
        await contentTextarea.setValue("Content long 10");
        await authorSelect
            .find(".select-options")
            .findAll("option")
            .at(0)
            .setSelected({ name: "Evelyn", id: 1 });

        await wrapper.vm.formSubmit();
        await actions.createNewPost();

        expect(actions.createNewPost).toHaveBeenCalledWith();

        expect(actions.closeModal).toHaveBeenCalled();
    });

    test("submits the form in edit mode when all fields are valid", async () => {
        wrapper.vm.formIsValid = true;

        state.formMode = "edit";
        const titleInput = wrapper.find("#title");
        const contentTextarea = wrapper.find("#content");
        await titleInput.setValue("Title");
        await contentTextarea.setValue("Content long 10");

        await wrapper.vm.formSubmit();

        expect(actions.editPost).toHaveBeenCalled();

        expect(actions.closeModal).toHaveBeenCalled();
        expect(mockRouter.push).toHaveBeenCalledWith("/");
    });
});
