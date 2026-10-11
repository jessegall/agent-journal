import {expect, test} from "vitest";
import {DEFAULT_HIDDEN, visibleIn} from "../src/domain/chatVisibility.js";
import {store} from "../src/state/store.js";

test("the chat hides acknowledgements and a sequence's steps, and shows it starting and finishing", () => {
    store.spec = {...store.spec, chat_kinds: {recalled: {}, marked: {list: "sequences"}}};
    const shown = visibleIn(DEFAULT_HIDDEN);
    expect(DEFAULT_HIDDEN).toEqual(["acknowledgements", "sequence_steps"]);
    expect(shown({type: "card", data: {icon: "list", kind: "sequence_steps"}})).toBe(false);
    expect(shown({type: "card", data: {icon: "list", kind: "sequences"}})).toBe(true);
    expect(shown({type: "card", data: {icon: "list"}})).toBe(true);
    expect(shown({type: "card", data: {icon: "branch"}})).toBe(true);
    expect(visibleIn(["sequences", "sequence_steps"])({type: "card", data: {icon: "list", kind: "sequences"}})).toBe(false);
    expect(visibleIn([])({type: "card", data: {icon: "list", kind: "sequence_steps"}})).toBe(true);
});
