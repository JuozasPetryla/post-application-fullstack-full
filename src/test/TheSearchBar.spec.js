import { createLocalVue, shallowMount } from "@vue/test-utils";
import Vuex from "vuex";
import { describe, test, expect, vi } from "vitest";
import TheSearchBar from "../components/layout/TheSearchBar.vue";


const localVue = createLocalVue();

localVue.use(Vuex);

describe("TheSearchBar.vue", () => {
  let actions;
  let store;

  beforeEach(() => {
    actions = {

    };

    store = new Vuex.Store({
      modules: {
        pagination: {
          actions,
        },
        search: {
          actions,
        },
      },
    });
  });

  test("Gets the search term when typing", async () => {
    vi.useFakeTimers();
    const wrapper = shallowMount(TheSearchBar, { store, localVue });
    wrapper.vm.search();
    const input = wrapper.find("input");
    await input.setValue("Hello");
    vi.runOnlyPendingTimers();
    expect(actions.getSearchTerm).toHaveBeenCalled();
    expect(wrapper.find('input[type="text"]').element.value).toBe("Hello");
  });
});
