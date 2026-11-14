import {createApp, h} from "vue";
import {afterEach, expect, test} from "vitest";
import PageHeader from "../kit/PageHeader.vue";

afterEach(() => (document.body.innerHTML = ""));

const drawn = (props, slots) => {
    const element = document.createElement("div");
    document.body.append(element);
    createApp({render: () => h(PageHeader, props, slots)}).mount(element);
    return element;
};

test("test_title_count_and_actions: the title, its count, then the primary action and the actions menu", () => {
    const element = drawn({title: "Skills", count: 14}, {primary: () => h("button", {"data-primary": ""}, "New"), actions: () => h("button", {"data-actions": ""}, "Actions")});
    expect(element.querySelector("h1").textContent).toBe("Skills14");
    expect(element.querySelector("[data-page-count]").textContent).toBe("14");
    const end = element.querySelector(".page-header-end");
    expect(end.children.length).toBe(2);
    expect(end.firstElementChild.hasAttribute("data-primary")).toBe(true);
    expect(end.lastElementChild.hasAttribute("data-actions")).toBe(true);
});

test("a header with no count and no actions is its title alone", () => {
    const element = drawn({title: "Settings"});
    expect(element.querySelector("[data-page-count]")).toBeNull();
    expect(element.querySelector(".page-header-end").children.length).toBe(0);
});
