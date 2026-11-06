export const AT_BOTTOM = 24;
export const NEAR_BOTTOM = 8;
export const SHORT_CHAT = 420;

// whether the docked cards stand open as the chat is scrolled, as version 4's did: scrolling down to the foot opens them, and a
// reader scrolling up and away from the foot folds them; the answer is null when the scroll leaves them as they are
export function dockOpening({top, before, height, shown}) {
    const gap = height - top - shown;
    if (gap <= AT_BOTTOM) return true;
    if (top < before && gap > NEAR_BOTTOM) return false;
    return null;
}

// a card folded by hand stays as the hand left it; otherwise it follows the chat's scroll and its height
export const dockFolded = (byHand, scrolled) => (byHand === undefined ? scrolled : byHand);
