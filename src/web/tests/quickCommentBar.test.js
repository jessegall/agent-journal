import {createApp, h, nextTick} from "vue";
import {describe, expect, test} from "vitest";
import QuickCommentBar from "../src/kit/QuickCommentBar.vue";

function mounted(props) {
    const host = window.document.createElement("div");
    window.document.body.append(host);
    createApp({render: () => h(QuickCommentBar, props)}).mount(host);
    return host;
}

async function type(host, text) {
    host.querySelector(".comment-bar-open").click();
    await nextTick();
    const box = host.querySelector("textarea");
    box.value = text;
    box.dispatchEvent(new Event("input"));
    await nextTick();
    return box;
}

const enter = (box, init = {}) => box.dispatchEvent(new KeyboardEvent("keydown", {key: "Enter", bubbles: true, cancelable: true, ...init}));
const settle = () => new Promise((done) => setTimeout(done));

describe("the quick comment bar", () => {
    test("starts collapsed, shows the comment count and opens a box on one click", async () => {
        const host = mounted({send: async () => {}, count: 2});
        expect(host.querySelector("textarea")).toBeNull();
        expect(host.querySelector(".count").textContent).toContain("2 comments");
        host.querySelector(".comment-bar-open").click();
        await nextTick();
        expect(host.querySelector("textarea")).not.toBeNull();
    });

    test("Enter sends the trimmed words and collapses, Shift+Enter does not send", async () => {
        const sent = [];
        const host = mounted({send: async (text) => sent.push(text)});
        const box = await type(host, "  Looks right  ");
        enter(box, {shiftKey: true});
        await settle();
        expect(sent).toEqual([]);
        enter(box);
        await settle();
        expect(sent).toEqual(["Looks right"]);
        expect(host.querySelector("textarea")).toBeNull();
        expect(host.querySelector(".prompt").textContent).toContain("Sent");
    });

    test("a refused send keeps the box open with the words and the reason", async () => {
        const host = mounted({
            send: async () => {
                throw new Error("No room");
            },
        });
        const box = await type(host, "Hello");
        enter(box);
        await settle();
        expect(host.querySelector("textarea").value).toBe("Hello");
        expect(host.querySelector(".error").textContent).toBe("No room");
    });
});
