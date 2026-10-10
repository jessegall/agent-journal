import {expect, test} from "vitest";
import {DEFAULT_HIDDEN, visibleIn} from "../src/domain/chatVisibility.js";
import {store} from "../src/state/store.js";

test("the chat hides acknowledgements and the sequence marks until they are switched on", () => {
    store.spec = {...store.spec, chat_kinds: {recalled: {}, marked: {list: "sequences"}}};
    const shown = visibleIn(DEFAULT_HIDDEN);
    expect(DEFAULT_HIDDEN).toEqual(["acknowledgements", "sequences"]);
    expect(shown({type: "card", data: {icon: "list"}})).toBe(false);
    expect(shown({type: "card", data: {icon: "branch"}})).toBe(true);
    expect(visibleIn([])({type: "card", data: {icon: "list"}})).toBe(true);
});
