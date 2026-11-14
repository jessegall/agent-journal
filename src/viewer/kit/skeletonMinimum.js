// how long a skeleton shows at the least, so a quick read never makes it a flash
export const SKELETON_MINIMUM_MS = 150;

// tests answer at once unless they stub the mode to ask for the minimum
const skeletonMinimumMs = () => (import.meta.env?.MODE === "test" ? 0 : SKELETON_MINIMUM_MS);

// runs `show` once the skeleton begun at `startedAt` has shown for its minimum
export function afterSkeletonMinimum(startedAt, show, minimumMs = skeletonMinimumMs(), now = performance.now()) {
    const left = startedAt + minimumMs - now;
    if (left <= 0) return void show();
    setTimeout(show, left);
}
