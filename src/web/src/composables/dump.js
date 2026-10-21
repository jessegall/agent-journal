import {computed, reactive, ref, watch} from "vue";
import {api} from "../api/client.js";
import {UPLOAD_LIMIT, overLimit} from "../chat/attachments.js";
import {meta} from "../domain/tables.js";
import {seconds} from "../domain/row.js";
import {TEXT_ITEM, itemLabel} from "../domain/dumpPile.js";
import {counted} from "../format/number.js";
import {useNow} from "./now.js";

const QUIET_AFTER = 180;
const SUMMING_FOR = 120;
const EARLIER = 4;

const joined = (d) => d.queued_at || seconds(d.created_at);
const names = (d) => [...(d.brief?.trim() ? (d.parts.length ? d.parts : [TEXT_ITEM]) : []), ...[...d.files].sort()];
const tableTitle = (table) => meta(table)?.title || table;
const inHandOf = (every) => every.filter((d) => !d.completed_at).sort((a, b) => joined(a) - joined(b) || a.id - b.id)[0] || null;

function pillOf(d, inHand) {
    if (d.removed_at) return "removed";
    if (d.stopped) return "stopped";
    if (d.completed_at) return "done";
    return inHand?.id === d.id ? "filing" : "queued";
}

export function earlierDumps(every) {
    const inHand = inHandOf(every);
    return [...every]
        .sort((a, b) => b.id - a.id)
        .slice(0, EARLIER)
        .map((d) => ({id: d.id, title: d.title, pill: pillOf(d, inHand)}));
}

export async function startDump(text, files) {
    const oversized = files.find((file) => file.size > UPLOAD_LIMIT);
    if (oversized) throw new Error(overLimit(oversized));
    const row = await api.create("dumps", {brief: text});
    for (const file of files) await api.upload("dumps", row.id, file);
    return row;
}

export function useDump(every, selected, rowsOf) {
    const fetched = reactive({});
    const taking = ref(-1);
    const more = reactive({names: [], error: ""});
    const inHand = computed(() => inHandOf(every.value));
    const dump = computed(() => every.value.find((d) => d.id === selected.value) || null);

    const items = computed(() =>
        dump.value
            ? names(dump.value).map((name) => {
                  const item = dump.value.items[name] || {};
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
    const working = computed(() => Boolean(dump.value && !dump.value.completed_at));
    const queued = computed(() => Boolean(working.value && inHand.value && inHand.value.id !== dump.value.id));
    const log = computed(() => dump.value?.log || []);
    const latest = computed(() => log.value[log.value.length - 1] || null);
    const started = computed(() => Boolean(log.value.length || items.value.some((i) => i.state !== "waiting")));
    const asked = computed(() => (working.value && dump.value.question?.text) || "");
    const guesses = computed(() => (asked.value && dump.value.question.guesses) || []);
    const quiet = computed(
        () => working.value && started.value && !queued.value && !asked.value && now.value - seconds(dump.value.updated_at) > QUIET_AFTER
    );
    const removed = computed(() => Boolean(dump.value?.removed_at));
    const stopped = computed(() => Boolean(dump.value?.stopped));

    const phase = computed(() => {
        if (!dump.value) return "";
        if (removed.value) return "removed";
        if (stopped.value) return "stopped";
        if (dump.value.completed_at) return "done";
        if (queued.value) return "queued";
        if (asked.value) return "asking";
        if (quiet.value) return "quiet";
        return started.value ? "filing" : "waiting";
    });
    const named = computed(() => Boolean(dump.value && dump.value.title !== `Dump ${dump.value.id}`));
    const collection = computed(() => (named.value ? dump.value.title : ""));

    const filedRefs = computed(() => [...new Set(items.value.flatMap((i) => i.refs))]);
    const writing = computed(() =>
        working.value && latest.value?.on && !filedRefs.value.includes(latest.value.on) ? latest.value.on : ""
    );
    const making = computed(() => (working.value && !asked.value && !writing.value && latest.value?.making) || "");
    const madeRefs = computed(() => [...filedRefs.value, ...(writing.value ? [writing.value] : [])]);
    const made = computed(() => [
        ...madeRefs.value
            .map((ref) => {
                const [table, id] = ref.split(":");
                const row = rowsOf(table).find((r) => r.id === Number(id)) || fetched[ref] || null;
                return {
                    ref,
                    table,
                    id: Number(id),
                    row,
                    writing: ref === writing.value,
                    from: items.value.filter((i) => i.refs.includes(ref)).map((i) => i.label),
                    added: items.value.some((i) => i.added.includes(ref)),
                    kind: tableTitle(table),
                    place: `${tableTitle(table)}s`,
                };
            }),
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
            const [table, id] = ref.split(":");
            if (rowsOf(table).some((r) => r.id === Number(id))) continue;
            try {
                fetched[ref] = await api.show(table, Number(id));
            } catch {
                delete fetched[ref];
            }
        }
    }
    watch([madeRefs, now], fetchMade, {immediate: true});

    const lines = computed(() => {
        const by = {};
        for (const m of filedRows.value) (by[m.table] = by[m.table] || []).push(m);
        return Object.entries(by).map(([table, list]) => {
            const word = tableTitle(table).toLowerCase();
            const own = list.filter((m) => m.added).length;
            return `${counted(list.length, word, `${word}s`)}${own ? `, ${own} of them added by the agent` : ""}`;
        });
    });
    const reportTitle = computed(() =>
        filedRows.value.length
            ? `Done. Filed ${counted(filedRows.value.length, "thing", "things")}${collection.value ? ` in “${collection.value}”` : ""}:`
            : "Done. Nothing was filed."
    );
    const summary = computed(() => dump.value?.summary || "");
    const options = computed(() => dump.value?.options || []);
    const suggestions = computed(() => {
        const taken = dump.value?.claimed || {};
        const left = dump.value?.declined || [];
        return options.value.map((o, pick) => ({
            pick,
            label: o.label,
            ask: o.ask || "",
            state: taken[pick] ? "taken" : left.includes(pick) ? "left" : "",
            busy: taking.value === pick,
        }));
    });
    const summing = computed(
        () => phase.value === "done" && !summary.value && !options.value.length && now.value - dump.value.completed_at < SUMMING_FOR
    );

    const timeline = computed(() => {
        const d = dump.value;
        if (!d) return [];
        const directions = d.summary_text.map((s, i) => ({key: `said:${i}`, time: s.time, mine: true, text: s.label}));
        const answers = d.answers.map((a, i) => ({key: `answer:${i}`, time: a.time, mine: true, text: a.answer}));
        const taken = Object.entries(d.claimed).map(([k, c]) => ({key: `taken:${k}`, time: c.time, mine: true, text: c.label}));
        const agent = log.value.map((e, i) => ({key: `log:${i}`, time: e.time, mine: false, text: e.text, detail: e.detail}));
        return [...agent, ...directions, ...answers, ...taken].sort((a, b) => a.time - b.time);
    });
    const current = computed(() => (phase.value === "filing" ? [...timeline.value].reverse().find((line) => !line.mine) || null : null));
    const step = computed(() => {
        const run = dump.value && rowsOf("agents").find((agent) => agent.sequence?.about === `dumps:${dump.value.id}`)?.sequence;
        return run ? `Step ${run.step} of ${run.steps}: ${run.text}` : "";
    });
    const thinking = computed(() => {
        if (step.value && (phase.value === "waiting" || (phase.value === "filing" && !log.value.length))) return step.value;
        if (phase.value === "waiting") return "Waiting: the agent";
        if (phase.value === "queued") return `Waiting in line behind dump ${inHand.value.id}`;
        if (phase.value === "quiet")
            return `No update for ${Math.round((now.value - seconds(dump.value.updated_at)) / 60)} min; the agent may be busy elsewhere`;
        if (phase.value === "filing" && !log.value.length) return "Reading the files";
        if (summing.value) return "Writing a summary";
        return "";
    });

    const note = computed(() => {
        const n = filedRows.value.length;
        switch (phase.value) {
            case "removed":
                return `Removed. The ${counted(dump.value.removed_refs.length, "thing", "things")} it filed are gone. What you dropped is still on dump ${dump.value.id}.`;
            case "stopped":
                return `Stopped. ${counted(n, "thing was", "things were")} filed and stay; the rest of the files were not read.`;
            case "done":
                return `${counted(n, "thing", "things")} filed. Rename or merge anything; it changes in the journal right away.`;
            default:
                return `${counted(n, "thing", "things")} filed so far. Each is filed as soon as it is written.`;
        }
    });

    const listed = computed(() => (removed.value ? [] : made.value));
    const adding = computed(() => [...new Set(more.names)].filter((name) => !items.value.some((i) => i.name === name)));

    const act = (action, body = {}) => api.act("dumps", dump.value.id, action, body);

    async function addMore(list) {
        const files = Array.from(list || []);
        if (!files.length || !working.value) return;
        const id = dump.value.id;
        more.error = "";
        more.names = [...more.names, ...files.map((f) => f.name)];
        try {
            for (const file of files) await api.upload("dumps", id, file);
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
        await api.change(m.table, m.id, {title});
        if (fetched[m.ref]) fetched[m.ref] = await api.show(m.table, m.id);
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
        hasCollection: named,
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
