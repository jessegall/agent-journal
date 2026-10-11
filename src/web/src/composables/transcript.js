import {computed, ref, unref, watch} from "vue";
import {api} from "../api/client.js";
import {pollKey, usePoll} from "./poll.js";
import {PAGE} from "../sync/rows.js";

const EVERY = 3000;
const NEAR_BOTTOM = 60;

export function useTranscript(agent, session, scroller, client = api, active = () => true) {
    const turns = ref([]);
    const total = ref(0);
    const first = ref(0);
    const folded = ref(new Set());
    const bodies = ref({});
    const opening = ref(new Set());
    const unread = ref({});
    const error = ref("");
    const loading = ref(true);
    const paging = ref(false);
    let fetching = false;

    const key = () => `${client.env()}:${agent()}:${unref(session) || ""}`;
    const earliest = computed(() => (turns.value.length ? turns.value[0].line : 0));
    const atStart = computed(() => turns.value.length > 0 && earliest.value <= first.value);

    async function fetchBody(line) {
        if (bodies.value[line] !== undefined || opening.value.has(line)) return;
        opening.value = new Set(opening.value).add(line);
        const asked = key();
        try {
            const got = await client.transcript(agent(), unref(session), {entry: line});
            if (asked === key()) bodies.value = {...bodies.value, [line]: got.text};
            unread.value = {...unread.value, [line]: ""};
        } catch (reason) {
            unread.value = {...unread.value, [line]: reason.message};
        } finally {
            const next = new Set(opening.value);
            next.delete(line);
            opening.value = next;
        }
    }

    function toggle(line) {
        const next = new Set(folded.value);
        if (next.has(line)) {
            next.delete(line);
            fetchBody(line);
        } else next.add(line);
        folded.value = next;
    }

    function foldTools(fresh) {
        const next = new Set(folded.value);
        fresh.filter((turn) => turn.kind === "tool").forEach((turn) => next.add(turn.line));
        folded.value = next;
    }

    async function fetchTurns() {
        if (fetching || !agent()) return;
        fetching = true;
        try {
            const since = turns.value.length ? turns.value[turns.value.length - 1].line : 0;
            const asked = key();
            const got = await client.transcript(agent(), unref(session), {since, last: PAGE});
            if (asked !== key()) return;
            error.value = "";
            total.value = got.total;
            first.value = got.first;
            if (!got.turns.length) return;
            const box = unref(scroller);
            const atBottom = !box || box.scrollHeight - box.scrollTop - box.clientHeight < NEAR_BOTTOM;
            foldTools(got.turns);
            turns.value = [...turns.value, ...got.turns];
            if (atBottom) requestAnimationFrame(() => unref(scroller) && (unref(scroller).scrollTop = unref(scroller).scrollHeight));
        } catch (reason) {
            error.value = reason.message;
        } finally {
            fetching = false;
            loading.value = false;
        }
    }

    async function earlier() {
        if (paging.value || atStart.value || !turns.value.length) return false;
        paging.value = true;
        try {
            const asked = key();
            const got = await client.transcript(agent(), unref(session), {before: earliest.value, last: PAGE});
            if (asked !== key()) return false;
            error.value = "";
            foldTools(got.turns);
            turns.value = [...got.turns, ...turns.value];
            return true;
        } catch (reason) {
            error.value = reason.message;
        } finally {
            paging.value = false;
        }
    }

    const retry = () => (turns.value.length && !atStart.value ? earlier() : fetchTurns());

    watch([() => unref(session), agent], () => {
        turns.value = [];
        bodies.value = {};
        unread.value = {};
        total.value = 0;
        first.value = 0;
        loading.value = true;
        error.value = "";
        fetchTurns();
    });

    const refresh = usePoll(pollKey(), fetchTurns, EVERY, undefined, active);

    return {turns, total, first, folded, bodies, opening, unread, error, loading, paging, atStart, toggle, earlier, retry, refresh};
}
