import {createApp, h, nextTick, ref} from "vue";
import {expect, test} from "vitest";
import AutoScrollPane from "../kit/AutoScrollPane.vue";
import {WINDOW_CONTEXT} from "../kit/windowContextKey.js";
import {settle} from "./support/windowContext.js";

function mountedPane(direction) {
    const rowCount = ref(0);
    const element = document.createElement("div");
    const app = createApp({render: () => h(AutoScrollPane, {rowCount: rowCount.value})});
    app.provide(WINDOW_CONTEXT, {autoScroll: direction});
    app.mount(element);
    const pane = element.querySelector(".auto-scroll-pane");
    Object.defineProperties(pane, {scrollHeight: {value: 1000, configurable: true}, clientHeight: {value: 100, configurable: true}});
    pane.scrollTo = ({top}) => (pane.scrollTop = top);
    return {element, pane, rowCount};
}

const scrolledTo = async (pane, top) => {
    pane.scrollTop = top;
    pane.dispatchEvent(new Event("scroll"));
    await nextTick();
};

const newest = (element) => element.querySelector("[data-scroll-newest]");

test("at the bottom a new row keeps the pane at the bottom and shows no button", async () => {
    const {element, pane, rowCount} = mountedPane("bottom");
    rowCount.value = 1;
    await settle();
    expect(pane.scrollTop).toBe(1000);
    expect(newest(element).style.display).toBe("none");
});

test("scrolling up stops following and shows Newest, and the button starts it again", async () => {
    const {element, pane, rowCount} = mountedPane("bottom");
    await scrolledTo(pane, 200);
    expect(newest(element).style.display).not.toBe("none");
    rowCount.value = 2;
    await settle();
    expect(pane.scrollTop).toBe(200);
    newest(element).click();
    await scrolledTo(pane, pane.scrollTop);
    expect(pane.scrollTop).toBe(1000);
    await new Promise((resolve) => setTimeout(resolve, 60));
    expect(newest(element).style.display).toBe("none");
});

test("a window that follows the top stays at the top", async () => {
    const {pane, rowCount, element} = mountedPane("top");
    await scrolledTo(pane, 0);
    rowCount.value = 3;
    await settle();
    expect(pane.scrollTop).toBe(0);
    await scrolledTo(pane, 300);
    expect(newest(element).style.display).not.toBe("none");
});
