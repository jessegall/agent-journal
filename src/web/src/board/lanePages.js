import {store} from "../state/store.js";

export const PAGE = 50;

let source = {fetch: null, query: () => ""};
const loading = new Set();

// Where the board asks for its pages: BoardPage says how a page of this board is fetched and which words filter it.
export const pagesFrom = (fetch, query = () => "") => (source = {fetch, query});

const bare = (lane) => ({...lane, cards: lane.cards || []});

// The board as the server pages it, with every page the viewer had already loaded kept: a lane that held more than one page is asked again for as many cards, so a poll never throws a scrolled lane back to its first fifty.
export async function loadLanes(fetch, held, query) {
    const got = await fetch({size: PAGE, query});
    const lanes = await Promise.all(
        got.lanes.map(async (lane) => {
            const before = (held || []).find((one) => one.key === lane.key);
            const wanted = before ? before.cards.length : 0;
            if (!lane.next || wanted <= lane.cards.length) return bare(lane);
            const whole = await fetch({lane: lane.key, size: wanted, query});
            return bare(whole.lanes.find((one) => one.key === lane.key) || lane);
        })
    );
    return {...got, lanes};
}

// The next page of one lane, added to the cards it has: the lane keeps its place and shows no skeleton while it comes.
export async function moreOfLane(lane) {
    if (!lane.next || loading.has(lane.key) || !source.fetch) return;
    loading.add(lane.key);
    try {
        const got = await source.fetch({lane: lane.key, after: lane.next, query: source.query()});
        const page = got.lanes.find((one) => one.key === lane.key);
        const kept = store.board.lanes.find((one) => one.key === lane.key);
        if (!page || !kept) return;
        const seen = new Set(kept.cards.map((card) => card.n));
        kept.cards = [...kept.cards, ...page.cards.filter((card) => !seen.has(card.n))];
        Object.assign(kept, {next: page.next, total: page.total});
    } finally {
        loading.delete(lane.key);
    }
}

export const loadingMore = (lane) => loading.has(lane.key);
