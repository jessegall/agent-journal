import {nextTick, ref} from "vue";
import {api} from "../api/client.js";
import {demand, usePoll} from "./poll.js";

const SMALL_ROWS = 6;
const SMALL_CHARS = 44;

const small = (card) =>
    !card.image &&
    (card.edit_type === "deleted" || (card.rows.length <= SMALL_ROWS && card.rows.every((row) => row.text.length <= SMALL_CHARS)));
const joins = (card, edit) => card.path === edit.path && card.edit_type !== "deleted" && edit.edit_type !== "deleted";
const tagged = (edit) => edit.rows.map((row) => ({...row, edit: edit.id}));

function merged(card, edit) {
    const gap = edit.first_line - card.last_line - 1;
    const between = gap ? [{line_type: "fold", line: null, text: "", hidden: Math.max(gap, 0), edit: edit.id}] : [];
    return {
        ...card,
        rows: [...card.rows, ...between, ...tagged(edit)],
        last_line: edit.last_line,
        added: card.added + edit.added,
        removed: card.removed + edit.removed,
        time: edit.time,
        latest: edit.id,
    };
}

function land(cards, edit) {
    const last = cards[cards.length - 1];
    const waiting = Boolean(last && last.half && last.alone);
    const before = cards.slice(0, -1);
    if (last && joins(last, edit)) {
        const card = merged(last, edit);
        return [...before, waiting && !small(card) ? {...card, half: false, alone: false} : card];
    }
    const card = {...edit, rows: tagged(edit), latest: edit.id};
    const fits = small(card);
    const kept = last ? [waiting ? {...last, half: fits, alone: false} : last] : [];
    return [...before, ...kept, {...card, half: fits, alone: fits && !waiting}];
}

export function useFileFeed(agent, follow, client = api) {
    const cards = ref([]);
    const ready = ref(false);
    const latest = ref("");
    const older = ref(false);
    const paging = ref(false);
    let cursor = 0;
    let earliest = 0;

    const reach = (edit) => (earliest = earliest ? Math.min(earliest, edit.id) : edit.id);

    usePoll("agent.edits", {
        params: () => ({client, agent, cursor}),
        take: (got) => {
            cursor = got.cursor;
            const live = ready.value;
            if (!live) older.value = got.older;
            ready.value = true;
            if (!got.edits.length) return;
            if (!earliest) reach(got.edits[0]);
            cards.value = got.edits.reduce(land, cards.value);
            latest.value = live ? got.edits[got.edits.length - 1].id : "";
            nextTick(() => (live ? follow.landed(got.edits.length) : follow.snap()));
        },
    });

    async function earlier() {
        if (paging.value || !older.value || !earliest) return 0;
        paging.value = true;
        try {
            const got = await demand("agent.edits.older", {client, agent, before: earliest});
            if (!got.edits.length) {
                older.value = false;
                return 0;
            }
            reach(got.edits[0]);
            older.value = got.older;
            const loaded = got.edits.reduce(land, []);
            const joined = loaded.map((card, i) => (i === loaded.length - 1 ? {...card, alone: false} : card));
            cards.value = [...joined, ...cards.value];
            return got.edits.length;
        } finally {
            paging.value = false;
        }
    }

    return {cards, ready, latest, older, earlier};
}
