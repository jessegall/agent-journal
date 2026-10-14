// @vitest-environment node
import {expect, test, vi} from "vitest";

const {useFollowing} = await import("../src/composables/following.js");

const pane = (at = 0, height = 1000, visible = 400) => ({scrollTop: at, scrollHeight: height, clientHeight: visible});
const atFoot = () => pane(600);

test("a reader at the foot is carried along by what arrives", () => {
    const box = atFoot();
    const {away, missed, arrived} = useFollowing(box);
    arrived();
    expect([away.value, missed.value, box.scrollTop]).toEqual([false, 0, box.scrollHeight]);
});

test("a reader who scrolled up is not moved, and what arrives is counted instead", () => {
    const box = pane(100);
    const {away, missed, arrived, scrolled} = useFollowing(box);
    scrolled();
    expect(away.value).toBe(true);
    arrived();
    arrived(3);
    expect([missed.value, box.scrollTop]).toEqual([4, 100]);
});

test("coming back to the foot follows again and forgets what was counted", () => {
    const box = pane(100);
    const {away, missed, arrived, scrolled} = useFollowing(box);
    scrolled();
    arrived(2);
    box.scrollTop = 600;
    scrolled();
    expect([away.value, missed.value]).toEqual([false, 0]);
    arrived();
    expect(box.scrollTop).toBe(box.scrollHeight);
});

test("taking the reader back to the newest clears what they missed", () => {
    const box = pane(0);
    const {away, missed, arrived, scrolled, toBottom} = useFollowing(box);
    scrolled();
    arrived(5);
    toBottom();
    expect([away.value, missed.value, box.scrollTop]).toEqual([false, 0, box.scrollHeight]);
});

test("the offer to go back waits a moment, so a glance up does not flash a button", () => {
    vi.useFakeTimers();
    const box = pane(100);
    const {showNewest, missed, arrived, scrolled} = useFollowing(box);
    scrolled();
    arrived(2);
    expect(showNewest.value).toBe(false);
    vi.advanceTimersByTime(2500);
    expect([showNewest.value, missed.value]).toEqual([true, 2]);
    box.scrollTop = 600;
    scrolled();
    expect(showNewest.value).toBe(false);
    vi.useRealTimers();
});

test("a pane told the reader scrolled up stops following without measuring", () => {
    const box = atFoot();
    const {away, arrived, left} = useFollowing(box);
    left();
    arrived(3);
    expect([away.value, box.scrollTop]).toEqual([true, 600]);
});
