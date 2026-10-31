import {createApp, h} from "vue";
import {afterEach, expect, test, vi} from "vitest";
import {settled} from "./settled.js";
import PairPage from "../src/pages/PairPage.vue";

afterEach(() => vi.unstubAllGlobals());

function page({code = "", answer = {ok: true}, opened = vi.fn()} = {}) {
    const posts = [];
    vi.stubGlobal("fetch", async (url, init) => {
        posts.push({url, body: JSON.parse(init.body)});
        return {ok: answer.ok, json: async () => (answer.ok ? {} : {error: answer.error})};
    });
    const element = document.createElement("div");
    createApp(() => h(PairPage, {code, opened})).mount(element);
    return {element, posts, opened};
}

test("a link that carries a code pairs at once and opens the viewer", async () => {
    const {posts, opened} = page({code: "ABCD-EFGH"});
    await settled();
    expect(posts).toEqual([{url: "/viewer/pair", body: {code: "ABCD-EFGH"}}]);
    expect(opened).toHaveBeenCalledOnce();
});

test("with no code in the link the page asks for one and pairs with what is typed", async () => {
    const {element, posts, opened} = page();
    await settled();
    expect(element.textContent).toContain("Pair this phone");
    expect(posts).toEqual([]);
    const input = element.querySelector("input");
    input.value = "abcd-efgh";
    input.dispatchEvent(new Event("input"));
    element.querySelector("form").dispatchEvent(new Event("submit"));
    await settled();
    expect(posts).toEqual([{url: "/viewer/pair", body: {code: "ABCD-EFGH"}}]);
    expect(opened).toHaveBeenCalledOnce();
});

test("a refused code shows why and leaves the page open", async () => {
    const {element, opened} = page({code: "ABCD-EFGH", answer: {ok: false, error: "this code pairs no phone"}});
    await settled();
    expect(element.textContent).toContain("this code pairs no phone");
    expect(opened).not.toHaveBeenCalled();
});
