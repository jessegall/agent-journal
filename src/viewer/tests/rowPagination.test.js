import {createApp, h, nextTick} from "vue";
import {expect, test, vi} from "vitest";
import {useRows} from "../kit/useRows.js";
import {WINDOW_CONTEXT} from "../kit/windowContextKey.js";

test("older stops at the last page even when a caller asks again", async () => {
    const read = vi.fn().mockResolvedValue({ok: true, value: {rows: [{id: 2}, {id: 1}], total: 2, page: 1, size: 50}});
    let listing;
    const app = createApp({setup() {
        listing = useRows("hook-call feed", [], {incremental: true});
        return () => h("div");
    }});
    app.provide(WINDOW_CONTEXT, {read, follow: () => {}});
    app.mount(document.createElement("div"));
    await nextTick();
    expect(listing.more.value).toBe(false);
    expect(await listing.older()).toBe(false);
    expect(await listing.older()).toBe(false);
    expect(read).toHaveBeenCalledTimes(1);
    expect(listing.rows.value.map((row) => row.id)).toEqual([2, 1]);
    app.unmount();
});

for (const size of [50, 200]) {
    test(`a feed without totals reads past its full ${size}-row page and stops after a short page`, async () => {
        const rows = Array.from({length: size}, (_, index) => ({id: size + 2 - index}));
        const read = vi.fn()
            .mockResolvedValueOnce({ok: true, value: {rows}})
            .mockResolvedValueOnce({ok: true, value: {rows: [{id: 2}, {id: 1}]}});
        let listing;
        const line = size === 50 ? "message feed" : `hook-call feed --limit ${size}`;
        const app = createApp({setup() {
            listing = useRows(line, [], {incremental: true});
            return () => h("div");
        }});
        app.provide(WINDOW_CONTEXT, {read, follow: () => {}});
        app.mount(document.createElement("div"));
        await nextTick();
        expect(listing.more.value).toBe(true);
        expect(await listing.older()).toBe(true);
        expect(read).toHaveBeenLastCalledWith(`${line} --before-id 3`);
        expect(listing.rows.value).toHaveLength(size + 2);
        expect(listing.more.value).toBe(false);
        expect(await listing.older()).toBe(false);
        expect(read).toHaveBeenCalledTimes(2);
        app.unmount();
    });
}
