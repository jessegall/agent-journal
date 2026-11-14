import {expect, test, vi} from "vitest";
import {afterSkeletonMinimum} from "../kit/skeletonMinimum.js";

test("a skeleton that began just now holds until its minimum has passed", () => {
    vi.useFakeTimers();
    const show = vi.fn();
    afterSkeletonMinimum(1000, show, 150, 1040);
    expect(show).not.toHaveBeenCalled();
    vi.advanceTimersByTime(109);
    expect(show).not.toHaveBeenCalled();
    vi.advanceTimersByTime(1);
    expect(show).toHaveBeenCalledOnce();
    vi.useRealTimers();
});

test("a read slower than the minimum shows at once", () => {
    const show = vi.fn();
    afterSkeletonMinimum(1000, show, 150, 1200);
    expect(show).toHaveBeenCalledOnce();
});
