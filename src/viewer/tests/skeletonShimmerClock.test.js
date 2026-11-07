import {afterEach, expect, test, vi} from "vitest";
import {appended as drawn} from "./support/windowContext.js";
import Skeleton from "../src/kit/Skeleton.vue";
import SkeletonLine from "../src/kit/SkeletonLine.vue";
import SkeletonParts from "../src/kit/SkeletonParts.vue";
import {shimmerStyle} from "../src/kit/shimmerClock.js";

afterEach(() => {
    vi.restoreAllMocks();
    document.body.innerHTML = "";
});

const BARS = [{width: "50%", height: 10}];

// the animation clock is the page's: a shimmer drawn at 5300 ms of a 2000 ms sweep starts 1300 ms in
test("the delay is the page's clock against the sweep's length", () => {
    expect(shimmerStyle(2000, 5300)).toEqual({"--shimmer-ms": "2000ms", animationDelay: "-1300ms"});
    expect(shimmerStyle(1600, 3200)).toEqual({"--shimmer-ms": "1600ms", animationDelay: "0ms"});
});

test("skeletons drawn at different moments join the same phase of the sweep", () => {
    const phaseAt = (now) => {
        vi.spyOn(performance, "now").mockReturnValue(now);
        const bar = drawn(SkeletonLine, {bars: BARS}).querySelector(".bar");
        return (now + Number.parseFloat(bar.style.animationDelay)) % 2000;
    };
    expect(phaseAt(7345)).toBe(phaseAt(7345 + 2000 * 3));
    expect(phaseAt(7345)).toBe(0);
});

test("a message skeleton and a line skeleton each take their delay from the clock", () => {
    vi.spyOn(performance, "now").mockReturnValue(4100);
    const message = drawn(Skeleton, {shape: "messages"}).querySelector(".skeleton-message");
    expect(message.style.animationDelay).toBe("-900ms");
    expect(message.style.getPropertyValue("--shimmer-ms")).toBe("1600ms");
    expect(drawn(SkeletonLine, {bars: BARS}).querySelector(".bar").style.animationDelay).toBe("-100ms");
});

test("the parts of a window's skeleton take their delay from the clock too", () => {
    vi.spyOn(performance, "now").mockReturnValue(4100);
    const parts = [{shape: "line", count: 1, width: "40%", size: "small"}, {shape: "circle", count: 1, size: "small"}, {shape: "block", count: 1, width: "50%", height: 30}];
    const shimmers = drawn(SkeletonParts, {parts}).querySelectorAll(".shimmer");
    expect(shimmers).toHaveLength(3);
    for (const element of shimmers) expect(element.style.animationDelay).toBe("-900ms");
});
