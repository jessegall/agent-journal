import {beforeEach, describe, expect, test} from "vitest";
import {loadLanes, moreOfLane, pagesFrom, PAGE} from "../src/board/lanePages.js";
import {store} from "../src/state/store.js";

const cards = (from, count) => Array.from({length: count}, (_, i) => ({n: from + i, title: `Card ${from + i}`}));

// A server of one lane holding `total` cards, paged by the cursor "after the card numbered N".
const serverOf = (total) => async ({after, size = PAGE, query}) => {
    const start = after ? Number(after) : 0;
    const held = cards(1, total).filter((card) => !query || card.title.includes(query));
    const page = held.filter((card) => card.n > start).slice(0, size);
    const left = held.filter((card) => card.n > start).length > page.length;
    return {lanes: [{key: "todo", title: "To do", cards: page, total: held.length, next: left ? String(page[page.length - 1].n) : ""}]};
};

beforeEach(() => {
    store.board.lanes = [];
});

describe("a board paged by lane", () => {
    test("shows each lane's first page with its total from the server, not the cards it holds", async () => {
        const got = await loadLanes(serverOf(200), [], "");
        const lane = got.lanes[0];
        expect([lane.cards.length, lane.total, Boolean(lane.next)]).toEqual([PAGE, 200, true]);
    });

    test("the next page of a lane adds its cards in place and moves the cursor on", async () => {
        const fetch = serverOf(200);
        pagesFrom(fetch);
        store.board.lanes = (await loadLanes(fetch, [], "")).lanes;
        const before = store.board.lanes[0];
        await moreOfLane(before);
        const lane = store.board.lanes[0];
        expect([lane.cards.length, lane.cards[PAGE].n, lane.total, lane.next]).toEqual([PAGE * 2, PAGE + 1, 200, String(PAGE * 2)]);
        await Promise.all([moreOfLane(lane), moreOfLane(lane)]);
        expect(store.board.lanes[0].cards.length).toBe(PAGE * 3);
    });

    test("the poll keeps every page the lane had loaded and its count", async () => {
        const fetch = serverOf(200);
        pagesFrom(fetch);
        store.board.lanes = (await loadLanes(fetch, [], "")).lanes;
        await moreOfLane(store.board.lanes[0]);
        await moreOfLane(store.board.lanes[0]);
        const polled = await loadLanes(fetch, store.board.lanes, "");
        expect([polled.lanes[0].cards.length, polled.lanes[0].total, polled.lanes[0].next]).toEqual([PAGE * 3, 200, String(PAGE * 3)]);
    });

    test("the words of a filter go to the server, so cards beyond the loaded page are found", async () => {
        const got = await loadLanes(serverOf(200), [], "Card 17");
        expect(got.lanes[0].cards.map((card) => card.n)).toEqual([17, 170, 171, 172, 173, 174, 175, 176, 177, 178, 179]);
    });
});
