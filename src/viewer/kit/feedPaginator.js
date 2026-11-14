import {nextTick} from "vue";

const TOP_PIXELS = 8;
const BOTTOM_PIXELS = 40;

// the paginators made in development, for a viewer test to read their breaches from
export const feeds = [];

// The one way a feed window pages. On open it shows the newest page only, scrolled to the bottom; scrolled to the top it reads exactly one
// page before the oldest one loaded and keeps the reader's place; rows that arrive later are added at the bottom, and the pane follows them
// only while it is at the bottom. A feed that breaks one of these throws in development, and in any mode `breaches` says what it broke.
//
// `source` is what the feed reads from: `loaded()` whether the newest page has answered, `count()` the rows or lines held, `pageSize()` the
// most one page holds, `more()` whether a page before the oldest one exists, and `previous()` which reads that page and says whether it did.
export class FeedPaginator {
    constructor(name, source, {top = TOP_PIXELS, development = Boolean(import.meta.env?.DEV)} = {}) {
        Object.assign(this, {name, source, top, development});
        this.breaches = [];
        this.shown = false;
        this.loading = false;
        if (development) feeds.push(this);
    }

    // a feed over a window's rows, as `useRows` and a window's props give them: refs of the rows, whether they loaded and whether more follow
    static ofRows(name, list, options) {
        return new FeedPaginator(name, {loaded: () => list.loaded.value, count: () => list.rows.value.length, pageSize: list.pageSize,
            more: () => list.more.value, previous: list.older}, options);
    }

    breach(message) {
        const text = `feed ${this.name}: ${message}`;
        this.breaches.push(text);
        if (this.development) throw new Error(text);
        return false;
    }

    isLoaded() {
        return this.source.loaded();
    }

    // the first rows of the feed are on screen, and the pane has been taken to its bottom
    drawn(pane) {
        if (this.shown || !this.source.loaded() || !this.source.count()) return;
        this.shown = true;
        const distance = pane.scrollHeight - pane.scrollTop - pane.clientHeight;
        if (distance > BOTTOM_PIXELS) this.breach(`opened ${distance}px above the bottom`);
        if (this.source.count() > this.source.pageSize()) this.breach(`opened with ${this.source.count()} rows, more than the newest page of ${this.source.pageSize()}`);
    }

    // the reader scrolled: at the top of the pane the page before the oldest one is read
    async reachTop(pane) {
        if (pane.scrollTop < this.top) return this.scrollUp(pane);
        return false;
    }

    // one earlier page is read, and a pane stays on the row it showed. Without a pane the reader asked for it by a button.
    async scrollUp(pane = null) {
        if (this.loading || !this.source.more()) return false;
        if (!this.source.loaded()) return this.breach("an earlier page was read before the newest page");
        if (pane && pane.scrollTop >= this.top) return this.breach(`an earlier page was read ${pane.scrollTop}px below the top`);
        this.loading = true;
        const held = this.source.count();
        const height = pane?.scrollHeight ?? 0;
        let found = false;
        try {
            found = await this.source.previous();
        } finally {
            this.loading = false;
        }
        const grown = this.source.count() - held;
        if (grown > this.source.pageSize()) this.breach(`one scroll up added ${grown} rows, a page is ${this.source.pageSize()}`);
        if (found && pane) {
            await nextTick();
            pane.scrollTop += pane.scrollHeight - height;
        }
        return found;
    }

    // rows too few to scroll leave no way to reach the top, so earlier pages are read until the pane scrolls or none is left
    async fill(pane) {
        while (pane.clientHeight > 0 && pane.scrollHeight <= pane.clientHeight && this.source.more() && await this.scrollUp()) await nextTick();
    }
}
