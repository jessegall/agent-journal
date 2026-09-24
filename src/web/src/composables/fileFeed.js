import {nextTick, ref} from "vue";
import {api} from "../api/client.js";
import {route} from "../route.js";
import {usePoll} from "../poll.js";

const EVERY = 2000;
const PAGE = 25;
const SMALL_ROWS = 6;
const SMALL_CHARS = 44;

const small = (card) =>
    card.kind === "deleted" || (card.rows.length <= SMALL_ROWS && card.rows.every((row) => row.text.length <= SMALL_CHARS));
const joins = (card, edit) => card.path === edit.path && card.kind !== "deleted" && edit.kind !== "deleted";
const tagged = (edit) => edit.rows.map((row) => ({...row, edit: edit.id}));

function merged(card, edit) {
    const gap = edit.first_line - card.last_line - 1;
    const between = gap ? [{kind: "fold", line: null, text: "", hidden: Math.max(gap, 0), edit: edit.id}] : [];
    return {
        ...card,
        rows: [...card.rows, ...between, ...tagged(edit)],
        last_line: edit.last_line,
        added: card.added + edit.added,
        removed: card.removed + edit.removed,
        at: edit.at,
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

export function useFileFeed(agent, follow) {
    const cards = ref([]);
    const ready = ref(false);
    const latest = ref("");
    const older = ref(false);
    const loading = ref(false);
    let cursor = 0;
    let oldest = null;

    usePoll(
        `edits:${route.value.env}:${agent}`,
        () => api.edits(agent, cursor, ready.value ? undefined : PAGE),
        EVERY,
        (got) => {
            cursor = got.cursor;
            const live = ready.value;
            ready.value = true;
            if (!live) older.value = !!got.older;
            if (oldest === null && got.edits.length) oldest = got.edits[0].at;
            if (!got.edits.length) return;
            cards.value = got.edits.reduce(land, cards.value);
            latest.value = live ? got.edits[got.edits.length - 1].id : "";
            nextTick(() => (live ? follow.landed(got.edits.length) : follow.snap()));
        }
    );

    async function loadOlder() {
        if (loading.value || !older.value || oldest === null) return false;
        loading.value = true;
        try {
            const got = await api.olderEdits(agent, oldest, PAGE);
            older.value = !!got.older;
            if (!got.edits.length) return false;
            oldest = got.edits[0].at;
            cards.value = [...got.edits.reduce(land, []), ...cards.value];
            return true;
        } finally {
            loading.value = false;
        }
    }

    return {cards, ready, latest, older, loading, loadOlder};
}
