import { createLocalVue, shallowMount } from "@vue/test-utils";
import Vuex from "vuex";
import { describe, test, expect, vi } from "vitest";
import ThePagination from "../components/layout/ThePagination.vue";

const localVue = createLocalVue();

localVue.use(Vuex);

describe("ThePagination.vue", () => {
  let actions;
  let store;
  let getters;
  let wrapper;

  beforeEach(() => {
    actions = {

    };



    store = new Vuex.Store({
      modules: {
        pagination: {
          actions,
          getters,
        },
      },
    });
    wrapper = shallowMount(ThePagination, { store, localVue });
  });

  test("Should render amount of pages based on the pages number", () => {
    const buttonLength = wrapper.findAll("button").length;
    const pages = getters.pages();
    expect(buttonLength).toBe(pages);
  });
  test("Page button should get the current page and set clicked button to active and disabled classes", () => {
    const buttons = wrapper.findAll("button");
    buttons.at(1).trigger("click");
    expect(actions.getCurrentPage).toHaveBeenCalled();
    expect(buttons.at(getters.curPage() - 1).classes()).toContain("active");
    expect(buttons.at(getters.curPage() - 1).classes()).toContain("disabled");
  });
});
