import {afterEach, expect, test, vi} from "vitest";
import {createApp, h, ref} from "vue";
import {useFittedBubble} from "../src/chat/fittedBubble.js";

const CHAT_WIDTH = 400;
const LINE_HEIGHT = 40;
let host;

afterEach(() => {
    host?.remove();
    vi.restoreAllMocks();
    delete Range.prototype.getClientRects;
});

// `narrowest` is the width under which the text takes a second line
function bubbleWithLines(lines, narrowest = 0) {
    const widthOf = (element) => parseFloat(element.style.width) || CHAT_WIDTH;
    vi.spyOn(HTMLElement.prototype, "offsetWidth", "get").mockImplementation(function () {
        return widthOf(this);
    });
    vi.spyOn(HTMLElement.prototype, "offsetHeight", "get").mockImplementation(function () {
        return widthOf(this) < narrowest ? LINE_HEIGHT * 2 : LINE_HEIGHT;
    });
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
    const bubble = bubbleWithLines([{left: 12, right: 200}, {left: 12, right: 212.4}, {left: 12, right: 150}], 227);
    expect(bubble.style.width).toBe("227px");
});

test("a width that would add a line gives way, so text that fits one line stays on one", () => {
    const bubble = bubbleWithLines([{left: 12, right: 212}], 300);
    expect(bubble.style.width).toBe("");
});

test("a bubble never narrows past its longest line to even out its lines", () => {
    const bubble = bubbleWithLines([{left: 12, right: 212}, {left: 12, right: 112}]);
    expect(bubble.style.width).toBe("226px");
});

test("a bubble with nothing measured keeps its width", () => {
    expect(bubbleWithLines([]).style.width).toBe("");
});
