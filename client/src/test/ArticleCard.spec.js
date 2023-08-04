import createWrapper from "./mockFactory";
import { describe, test, expect } from "vitest";
import ArticleCard from "../components/article/ArticleCard.vue";
describe("ArticleCard.vue", () => {

  let wrapper;

  beforeEach(() => {

    wrapper = createWrapper(ArticleCard, {
      propsData: {
        author: "Author",
        title: "Title",
        date: "Date",
        id: 1,
      },
    });
  });


  test("card to contain required text", () => {
    expect(wrapper.find("h2").text()).toBe("Author");
    expect(wrapper.find("h3").text()).toBe("Title");
    expect(wrapper.find("p").text()).toBe("Date");
  });

  test("card should emit clickCard event", () => {
    wrapper.trigger("click");
    expect(wrapper.emitted()).toHaveProperty("clickCard");
  });

  test("cards edit button should open modal window, set mode to edit and get the edit id", async () => {
    await wrapper.find(".editButton").trigger("click");
    const action = await wrapper.vm.$store.store._actions.openModal[0]()
    expect(action).toHaveBeenCalled()
  });

  test("cards delete button should open info modal window and get the delete id", async () => {
    wrapper.findComponent(".deleteButton").trigger("click");
    expect(openInfoModal).toHaveBeenCalled();
    expect(getDeleteId).toHaveBeenCalled();
  });
});
