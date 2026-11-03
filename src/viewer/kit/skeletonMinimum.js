// how long a skeleton shows at the least, so a quick read never makes it a flash; tests answer at once unless they ask for it
export const SKELETON_MINIMUM_MS = import.meta.env?.MODE === "test" ? 0 : 150;

// runs `show` once the skeleton begun at `startedAt` has shown for its minimum
export function afterSkeletonMinimum(startedAt, show, minimumMs = SKELETON_MINIMUM_MS, now = performance.now()) {
    const left = startedAt + minimumMs - now;
    if (left <= 0) return void show();
    setTimeout(show, left);
}
