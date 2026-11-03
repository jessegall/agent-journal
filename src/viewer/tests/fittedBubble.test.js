import {afterEach, expect, test, vi} from "vitest";
import {createApp, h, ref} from "vue";
import {useFittedBubble} from "../src/chat/fittedBubble.js";

const CHAT_WIDTH = 400;
let host;

afterEach(() => {
    host?.remove();
    vi.restoreAllMocks();
    delete Range.prototype.getClientRects;
});

function bubbleWithLines(lines) {
    vi.spyOn(HTMLElement.prototype, "offsetWidth", "get").mockReturnValue(CHAT_WIDTH);
    Range.prototype.getClientRects = () => lines;
    host = document.createElement("div");
    document.body.append(host);
    const bubble = ref(null);
    const text = ref("some words");
    createApp({
        setup() {
            useFittedBubble(bubble, text);
            return () => h("div", {ref: bubble, style: "padding: 0 13px; border: 0"}, text.value);
        },
    }).mount(host);
    return bubble.value;
}

test("a bubble is as wide as its longest line and its padding", () => {
    const bubble = bubbleWithLines([{left: 12, right: 200}, {left: 12, right: 212.4}, {left: 12, right: 150}]);
    expect(bubble.style.width).toBe("227px");
});

test("a bubble with nothing measured keeps its width", () => {
    expect(bubbleWithLines([]).style.width).toBe("");
});
