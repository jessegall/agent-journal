import {readFileSync} from "node:fs";
import {resolve} from "node:path";
import {createApp, h} from "vue";
import {afterEach, expect, test} from "vitest";
import ChatMark from "../src/kit/ChatMark.vue";

const SOURCE = readFileSync(resolve(__dirname, "../src/kit/ChatMark.vue"), "utf8");
const MARK = {key: "agent:1", label: "Judging", name: "A long description of what is being judged that does not fit the line", icon: "dot"};
let app;
let host;

afterEach(() => {
    app?.unmount();
    host?.remove();
});

function mounted() {
    host = document.createElement("div");
    document.body.append(host);
    app = createApp({render: () => h(ChatMark, {mark: MARK})});
    app.mount(host);
    return host.querySelector(".mark .head");
}

test("the title and the description beside it are separate parts of the mark's line", () => {
    const head = mounted();
    expect(head.querySelector(":scope > .title").textContent).toBe("Judging");
    expect(head.querySelector(":scope > strong").textContent).toBe(MARK.name);
});

test("the title does not shrink, so it keeps its full width", () => {
    expect(SOURCE).toMatch(/\.head \.title \{[^}]*flex: none;/);
});

test("the description is the part that is shortened with an ellipsis", () => {
    expect(SOURCE).toMatch(/\.head strong \{[^}]*min-width: 0;[^}]*overflow: hidden;[^}]*text-overflow: ellipsis;/);
});
