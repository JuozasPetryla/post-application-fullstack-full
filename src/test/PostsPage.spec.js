import { createLocalVue, shallowMount } from "@vue/test-utils";
import Vuex from "vuex";
import createWrapper from "./mockFactory";
import { describe, test, expect, vi } from "vitest";
import PostsPage from "../views/PostsPage.vue";
const localVue = createLocalVue();

localVue.use(Vuex);

describe("PostsPage.vue", () => {
  let actions;
  let store;
  let getters;
  let wrapper;
  let mockRoute;
  let mockRouter;

  beforeEach(() => {
    actions = {
      
    };

    getters = {
      
    };

    store = new Vuex.Store({
      modules: {
        posts: {
          actions,
          getters,
        },
        pagination: {
          actions,
          getters,
        },
        search: {
          actions,
          getters,
        },
        form: {
          actions,
        },
        infoModal: {
          actions,
          getters,
        },
      },
    });

    mockRoute = {
      params: {
        id: 1,
      },
    };
    mockRouter = {
      push: vi.fn(),
    };
    wrapper = createWrapper(PostsPage, {
      store,
      localVue,
      mocks: {
        $route: mockRoute,
        $router: mockRouter,
      },
    });
  });

  test("Should fetch and render posts with authors and pagination", () => {
    expect(actions.getPosts).toHaveBeenCalled();
    expect(actions.getAuthors).toHaveBeenCalled();
    expect(wrapper.findAllComponents({ name: "ArticleCard" }).exists()).toBe(
      true
    );
    expect(wrapper.findComponent({ name: "ThePagination" }).exists()).toBe(
      true
    );
  });
  test('Should not render "There are no posts here"', () => {
    expect(wrapper.find("h2").exists()).toBe(false);
  });
  test("Should get post id when clicked on article card and redirect to another route", async () => {
    const card = wrapper.findAllComponents({ name: "ArticleCard" });
    await card.at(0).trigger("clickCard");
    await wrapper.vm.getPostId();
    expect(actions.getPostDetailId).toHaveBeenCalled();
    expect(actions.getCurrentPost).toHaveBeenCalled();
    expect(mockRouter.push).toHaveBeenCalledOnce();
    expect(mockRouter.push).toHaveBeenCalledWith("/postDetail/" + mockRoute.id);
  });

  test("Should not render the dynamic form component", () => {
    expect(wrapper.find(".modal-dynamic-component").exists()).toBe(false);
  });
});
