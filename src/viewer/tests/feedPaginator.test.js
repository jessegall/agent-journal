import {expect, test} from "vitest";
import {FeedPaginator} from "../kit/feedPaginator.js";

const PAGE = 3;

// a feed over a list of ids, newest page first, in a pane that is 100px tall and 1000px long
function feedOf({held = [10, 11, 12], more = true, loaded = true, previous, development = true} = {}) {
    const rows = {value: held};
    const source = {loaded: () => loaded, count: () => rows.value.length, pageSize: () => PAGE, more: () => more,
        previous: previous ?? (async () => { rows.value = [7, 8, 9, ...rows.value]; return true; })};
    return {rows, feed: new FeedPaginator("test", source, {development})};
}
const paneAt = (scrollTop) => ({scrollTop, scrollHeight: 1000, clientHeight: 100});

test("a feed that opens at the bottom with the newest page only breaks nothing", () => {
    const {feed} = feedOf();
    feed.drawn(paneAt(900));
    expect(feed.breaches).toEqual([]);
});

test("in development a feed opened anywhere but the bottom throws", () => {
    const {feed} = feedOf();
    expect(() => feed.drawn(paneAt(0))).toThrow("feed test: opened 900px above the bottom");
});

test("in development a feed that opened with more than the newest page throws", () => {
    const {feed} = feedOf({held: [1, 2, 3, 4]});
    expect(() => feed.drawn(paneAt(900))).toThrow("opened with 4 rows, more than the newest page of 3");
});

test("in development one scroll up that read more than one page throws", async () => {
    const {rows, feed} = feedOf({previous: async () => { rows.value = [1, 2, 3, 4, 5, 6, 7, ...rows.value]; return true; }});
    await expect(feed.scrollUp(paneAt(0))).rejects.toThrow("one scroll up added 7 rows, a page is 3");
});

test("in development an earlier page read before the newest page throws", async () => {
    const {feed} = feedOf({loaded: false});
    await expect(feed.scrollUp()).rejects.toThrow("an earlier page was read before the newest page");
});

test("in development an earlier page read away from the top of the pane throws", async () => {
    const {feed} = feedOf();
    await expect(feed.scrollUp(paneAt(500))).rejects.toThrow("an earlier page was read 500px below the top");
});

test("outside development a broken rule is listed and nothing throws", () => {
    const {feed} = feedOf({development: false});
    feed.drawn(paneAt(0));
    expect(feed.breaches).toEqual(["feed test: opened 900px above the bottom"]);
});

test("scrolling to the top reads one earlier page and keeps the reader on the row the pane showed", async () => {
    const {rows, feed} = feedOf();
    const pane = paneAt(0);
    pane.scrollHeight = 1000;
    const read = feed.source.previous;
    feed.source.previous = async () => {
        const found = await read();
        pane.scrollHeight = 1300;
        return found;
    };
    expect(await feed.reachTop(pane)).toBe(true);
    expect(rows.value).toEqual([7, 8, 9, 10, 11, 12]);
    expect(pane.scrollTop).toBe(300);
});

test("scrolling below the top reads nothing", async () => {
    let reads = 0;
    const {feed} = feedOf({previous: async () => { reads += 1; return true; }});
    expect(await feed.reachTop(paneAt(400))).toBe(false);
    expect(reads).toBe(0);
});

test("a feed with no earlier page reads nothing when scrolled to the top", async () => {
    let reads = 0;
    const {feed} = feedOf({more: false, previous: async () => { reads += 1; return true; }});
    expect(await feed.reachTop(paneAt(0))).toBe(false);
    expect(reads).toBe(0);
});

test("a feed too short to scroll reads earlier pages until it can", async () => {
    const {rows, feed} = feedOf({held: [12]});
    const pane = {scrollTop: 0, clientHeight: 100, get scrollHeight() { return rows.value.length > 3 ? 500 : 100; }};
    await feed.fill(pane);
    expect(rows.value).toEqual([7, 8, 9, 12]);
});

test("two scrolls to the top at once read one page", async () => {
    let reads = 0;
    const {feed} = feedOf({previous: async () => { reads += 1; return true; }});
    await Promise.all([feed.scrollUp(paneAt(0)), feed.scrollUp(paneAt(0))]);
    expect(reads).toBe(1);
});
