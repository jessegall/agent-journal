import {getCurrentScope, onScopeDispose, ref} from "vue";

export const AT_BOTTOM = 24;
// How far from the foot still counts as being at the foot. A line of text is taller than this, so a reader who has
// scrolled at all has left it, and one who simply has not moved has not.

const NEWEST_AFTER = 1000;
const NEWEST_AFTER_BOTTOM = 2000;

/**
 * Whether a scrolling pane is following what arrives, which is the one rule the chat and the agent inspector share.
 *
 * At the foot, the reader is following and new content carries them along. Having scrolled up, they are reading, and
 * nothing moves under them; what arrives is counted instead, so the pane can offer to take them to it. The offer waits
 * a moment, and longer for a reader who has only just left the foot, so a glance up does not flash a button.
 */
export function useFollowing(scroller, at = AT_BOTTOM) {
    const away = ref(false);
    const missed = ref(0);
    const showNewest = ref(false);
    let newestTimer = 0;
    let leftAt = 0;

    const box = () => (scroller && "value" in scroller ? scroller.value : scroller);

    const gap = () => {
        const s = box();
        return s ? s.scrollHeight - s.scrollTop - s.clientHeight : 0;
    };

    const atBottom = () => !box() || gap() <= at;

    function offerNewest(now) {
        clearTimeout(newestTimer);
        if (!now) {
            showNewest.value = false;
            leftAt = Date.now();
            return;
        }
        const wait = Date.now() - leftAt < NEWEST_AFTER_BOTTOM ? NEWEST_AFTER_BOTTOM : NEWEST_AFTER;
        newestTimer = setTimeout(() => (showNewest.value = away.value), wait);
    }

    /** The reader is at the foot again and following what arrives; the pane is not moved. */
    function follow() {
        away.value = false;
        missed.value = 0;
        offerNewest(false);
    }

    /** Takes the reader to the foot, where they follow again and nothing is missed. */
    function toBottom(smooth = false) {
        const s = box();
        if (s && smooth && s.scrollTo) s.scrollTo({top: s.scrollHeight, behavior: "smooth"});
        else if (s) s.scrollTop = s.scrollHeight;
        follow();
    }

    /** The reader has scrolled up and is reading: nothing moves under them from here. */
    function left() {
        if (away.value) return;
        away.value = true;
        offerNewest(true);
    }

    /** Called when the reader scrolls: leaving the foot stops the following, returning to it starts again. */
    function scrolled() {
        if (atBottom()) follow();
        else left();
    }

    /** Called when content arrives: it carries a following reader along, and is only counted for one who is reading. */
    function arrived(howMany = 1, smooth = false) {
        if (away.value) missed.value += Math.max(0, howMany);
        else toBottom(smooth);
    }

    if (getCurrentScope()) onScopeDispose(() => clearTimeout(newestTimer));

    return {away, missed, showNewest, gap, atBottom, follow, toBottom, left, scrolled, arrived};
}
