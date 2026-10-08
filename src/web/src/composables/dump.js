import {computed, reactive, ref, watch} from "vue";
import {api} from "../api/client.js";
import {store} from "../state/store.js";
import {TEXT_ITEM, itemLabel} from "../domain/dumpPile.js";
import {counted} from "../format/number.js";
import {useNow} from "./now.js";

const QUIET_AFTER = 180;
const SUMMING_FOR = 120;
const EARLIER = 4;

const joined = (d) => d.data?.queued_at || d.created;
const names = (d) => [...(d.brief?.trim() ? d.data?.parts || [TEXT_ITEM] : []), ...Object.keys(d.data?.files || {}).sort()];
const typeTitle = (type) => store.spec?.types?.[type]?.title || type;
const inHandOf = (every) => every.filter((d) => !d.completed).sort((a, b) => joined(a) - joined(b) || a.n - b.n)[0] || null;

function pillOf(d, inHand) {
    if (d.data?.removed) return "removed";
    if (d.data?.stopped) return "stopped";
    if (d.completed) return "done";
    return inHand?.n === d.n ? "filing" : "queued";
}

export function earlierDumps(every) {
    const inHand = inHandOf(every);
    return [...every]
        .sort((a, b) => b.n - a.n)
        .slice(0, EARLIER)
        .map((d) => ({n: d.n, title: d.title, pill: pillOf(d, inHand)}));
}

export async function startDump(text, files) {
    const row = await api.create("dump", text ? {brief: text} : {title: files[0].name.slice(0, 80), brief: ""});
    for (const file of files) await api.upload("dump", row.n, file);
    return row;
}

export function useDump(every, selected, rowsOf, sequenceKey) {
    const fetched = reactive({});
    const taking = ref(-1);
    const more = reactive({names: [], error: ""});
    const inHand = computed(() => inHandOf(every.value));
    const dump = computed(() => every.value.find((d) => d.n === selected.value) || null);

    const items = computed(() =>
        dump.value
            ? names(dump.value).map((name) => {
                  const item = (dump.value.data.items || {})[name] || {};
                  const state = item.failed ? "failed" : item.outcome ? "filed" : item.insight ? "read" : "waiting";
                  return {
                      name,
                      label: itemLabel(name),
                      state,
                      note: item.failed || item.outcome || item.insight || "",
                      refs: item.refs || [],
                      added: item.added || [],
                  };
              })
            : []
    );
    const settled = computed(() => items.value.filter((i) => i.state === "filed" || i.state === "failed").length);

    const now = useNow(3000);
    const working = computed(() => Boolean(dump.value && !dump.value.completed));
    const queued = computed(() => Boolean(working.value && inHand.value && inHand.value.n !== dump.value.n));
    const log = computed(() => dump.value?.data?.log || []);
    const latest = computed(() => log.value[log.value.length - 1] || null);
    const started = computed(() => Boolean(log.value.length || items.value.some((i) => i.state !== "waiting")));
    const asked = computed(() => (working.value && dump.value.data?.question?.text) || "");
    const guesses = computed(() => (asked.value && dump.value.data.question.guesses) || []);
    const quiet = computed(
        () => working.value && started.value && !queued.value && !asked.value && now.value - (dump.value.updated || 0) > QUIET_AFTER
    );
    const removed = computed(() => Boolean(dump.value?.data?.removed));
    const stopped = computed(() => Boolean(dump.value?.data?.stopped));

    const phase = computed(() => {
        if (!dump.value) return "";
        if (removed.value) return "removed";
        if (stopped.value) return "stopped";
        if (dump.value.completed) return "done";
        if (queued.value) return "queued";
        if (asked.value) return "asking";
        if (quiet.value) return "quiet";
        return started.value ? "filing" : "waiting";
    });
    const named = computed(() => Boolean(dump.value && dump.value.title !== `Dump ${dump.value.n}`));
    const collection = computed(() => (named.value ? dump.value.title : ""));
    const hasCollection = computed(() => Boolean(dump.value?.refs?.some((r) => r.startsWith("collection:"))));

    const filedRefs = computed(() => [...new Set(items.value.flatMap((i) => i.refs))].filter((r) => !r.startsWith("collection:")));
    const writing = computed(() =>
        working.value && latest.value?.on && !filedRefs.value.includes(latest.value.on) ? latest.value.on : ""
    );
    const making = computed(() => (working.value && !asked.value && !writing.value && latest.value?.making) || "");
    const madeRefs = computed(() => [...filedRefs.value, ...(writing.value ? [writing.value] : [])]);
    const made = computed(() => [
        ...madeRefs.value
            .map((ref) => {
                const [type, n] = ref.split(":");
                const row = rowsOf(type).find((r) => r.n === Number(n)) || fetched[ref] || null;
                return {
                    ref,
                    type,
                    n: Number(n),
                    row,
                    writing: ref === writing.value,
                    from: items.value.filter((i) => i.refs.includes(ref)).map((i) => i.label),
                    added: items.value.some((i) => i.added.includes(ref)),
                    kind: typeTitle(type),
                    place: `${typeTitle(type)}s`,
                };
            })
            .filter((m) => !m.row?.deleted),
        ...(making.value
            ? [
                  {
                      ref: `making:${making.value}`,
                      making: making.value.split(",").slice(1).join(",").trim() || making.value,
                      writing: true,
                      from: [],
                  },
              ]
            : []),
    ]);
    const filedRows = computed(() => made.value.filter((m) => m.row && !m.writing));

    async function fetchMade() {
        for (const ref of madeRefs.value) {
            const [type, n] = ref.split(":");
            if (rowsOf(type).some((r) => r.n === Number(n))) continue;
            try {
                fetched[ref] = await api.show(type, Number(n));
            } catch {
                delete fetched[ref];
            }
        }
    }
    watch([madeRefs, now], fetchMade, {immediate: true});

    const lines = computed(() => {
        const by = {};
        for (const m of filedRows.value) (by[m.type] = by[m.type] || []).push(m);
        return Object.entries(by).map(([type, list]) => {
            const word = typeTitle(type).toLowerCase();
            const own = list.filter((m) => m.added).length;
            return `${counted(list.length, word, `${word}s`)}${own ? `, ${own} of them added by the agent` : ""}`;
        });
    });
    const reportTitle = computed(() =>
        filedRows.value.length
            ? `Done. Filed ${counted(filedRows.value.length, "thing", "things")}${collection.value ? ` in “${collection.value}”` : ""}:`
            : "Done. Nothing was filed."
    );
    const summary = computed(() => dump.value?.data?.summary || "");
    const options = computed(() => dump.value?.data?.options || []);
    const suggestions = computed(() => {
        const taken = dump.value?.data?.taken || {};
        const left = dump.value?.data?.declined || [];
        return options.value.map((o, pick) => ({
            pick,
            label: o.label,
            ask: o.ask || "",
            state: taken[pick] ? "taken" : left.includes(pick) ? "left" : "",
            busy: taking.value === pick,
        }));
    });
    const summing = computed(
        () => phase.value === "done" && !summary.value && !options.value.length && now.value - dump.value.completed < SUMMING_FOR
    );

    const timeline = computed(() => {
        const d = dump.value;
        if (!d) return [];
        const directions = (d.data?.said || []).map((s, i) => ({key: `said:${i}`, at: s.at, mine: true, text: s.label}));
        const answers = (d.data?.answers || []).map((a, i) => ({key: `answer:${i}`, at: a.at, mine: true, text: a.answer}));
        const taken = Object.entries(d.data?.taken || {}).map(([k, c]) => ({key: `taken:${k}`, at: c.at, mine: true, text: c.label}));
        const agent = log.value.map((e, i) => ({key: `log:${i}`, at: e.at, mine: false, text: e.text, detail: e.detail}));
        return [...agent, ...directions, ...answers, ...taken].sort((a, b) => a.at - b.at);
    });
    const current = computed(() => (phase.value === "filing" ? [...timeline.value].reverse().find((line) => !line.mine) || null : null));
    const step = computed(() => {
        const key = dump.value && sequenceKey(dump.value);
        const running = key && rowsOf("sequence").find((sequence) => sequence.data.runs && sequence.data.runs[key]);
        if (!running) return "";
        const at = running.data.runs[key].step;
        return `Step ${at} of ${running.sections.length}: ${running.sections[at - 1].title}`;
    });
    const thinking = computed(() => {
        if (step.value && (phase.value === "waiting" || (phase.value === "filing" && !log.value.length))) return step.value;
        if (phase.value === "waiting") return "Waiting for the agent";
        if (phase.value === "queued") return `Waiting in line behind dump ${inHand.value.n}`;
        if (phase.value === "quiet")
            return `No update for ${Math.round((now.value - dump.value.updated) / 60)} min; the agent may be busy elsewhere`;
        if (phase.value === "filing" && !log.value.length) return "Reading the files";
        if (summing.value) return "Writing a summary";
        return "";
    });

    const note = computed(() => {
        const n = filedRows.value.length;
        switch (phase.value) {
            case "removed":
                return `Removed. The collection and the ${counted(dump.value.data.removed_refs?.length || 0, "thing", "things")} it held are gone. What you dropped is still on dump ${dump.value.n}.`;
            case "stopped":
                return `Stopped. ${counted(n, "thing was", "things were")} filed and stay in the collection; the rest of the files were not read.`;
            case "done":
                return `${counted(n, "thing", "things")} filed. Rename or merge anything; it changes in the journal right away.`;
            default:
                return `${counted(n, "thing", "things")} filed so far. Each goes into the collection as soon as it is written.`;
        }
    });

    const listed = computed(() => (removed.value ? [] : made.value));
    const adding = computed(() => [...new Set(more.names)].filter((name) => !items.value.some((i) => i.name === name)));

    const act = (action, body = {}) => api.act("dump", dump.value.n, action, body);

    async function addMore(list) {
        const files = Array.from(list || []);
        if (!files.length || !working.value) return;
        const n = dump.value.n;
        more.error = "";
        more.names = [...more.names, ...files.map((f) => f.name)];
        try {
            for (const file of files) await api.upload("dump", n, file);
        } catch (e) {
            more.error = e.message;
        } finally {
            more.names = more.names.filter((name) => !files.some((f) => f.name === name));
        }
    }

    async function take(pick) {
        taking.value = pick;
        try {
            await act("choose", {pick});
        } finally {
            taking.value = -1;
        }
    }

    async function renameCollection(title) {
        if (title !== collection.value) await act("name", {title});
    }

    async function renameRow(m, title) {
        await api.act(m.type, m.n, "update", {title});
        if (fetched[m.ref]) fetched[m.ref] = await api.show(m.type, m.n);
    }

    const earlierRows = computed(() => earlierDumps(every.value));

    return {
        dump,
        items,
        settled,
        working,
        asked,
        guesses,
        removed,
        phase,
        collection,
        hasCollection,
        filedRows,
        lines,
        reportTitle,
        summary,
        suggestions,
        summing,
        timeline,
        current,
        thinking,
        note,
        listed,
        more,
        adding,
        earlierRows,
        act,
        addMore,
        answer: (text) => act("answer", {text}),
        say: (how) => act("direct", {how}),
        take,
        leave: (pick) => act("decline", {pick}),
        renameCollection,
        renameRow,
    };
}
