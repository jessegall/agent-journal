import {computed, ref, unref, watch} from "vue";
import {api} from "../api/client.js";
import {usePoll} from "../poll.js";
import {PAGE} from "../sync/rows.js";
import {keepingPlace} from "./scrollback.js";

const EVERY = 3000;
const NEAR_BOTTOM = 60;

export function useTranscript(agent, session, scroller, client = api) {
    const turns = ref([]);
    const total = ref(0);
    const first = ref(0);
    const folded = ref(new Set());
    const error = ref("");
    const loading = ref(true);
    const paging = ref(false);
    let fetching = false;

    const key = () => `${client.env()}:${agent()}:${unref(session) || ""}`;
    const earliest = computed(() => (turns.value.length ? turns.value[0].line : 0));
    const atStart = computed(() => turns.value.length > 0 && earliest.value <= first.value);

    function toggle(line) {
        const next = new Set(folded.value);
        if (next.has(line)) next.delete(line);
        else next.add(line);
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
        if (paging.value || atStart.value || !turns.value.length) return;
        paging.value = true;
        try {
            await keepingPlace(scroller, async () => {
                const asked = key();
                const got = await client.transcript(agent(), unref(session), {before: earliest.value, last: PAGE});
                if (asked !== key()) return false;
                error.value = "";
                foldTools(got.turns);
                turns.value = [...got.turns, ...turns.value];
            });
        } catch (reason) {
            error.value = reason.message;
        } finally {
            paging.value = false;
        }
    }

    const retry = () => (turns.value.length && !atStart.value ? earlier() : fetchTurns());

    watch([() => unref(session), agent], () => {
        turns.value = [];
        total.value = 0;
        first.value = 0;
        loading.value = true;
        error.value = "";
        fetchTurns();
    });

    usePoll(`transcript:${agent()}`, fetchTurns, EVERY);

    return {turns, total, first, folded, error, loading, paging, atStart, toggle, earlier, retry};
}
