<script setup>
import {computed, reactive, ref, watch} from "vue";
import {api} from "../api/client.js";
import {store} from "../state/store.js";
import {rows} from "../sync/rows.js";
import {peek} from "../route.js";
import Icon from "../kit/Icon.vue";
import Btn from "../kit/Btn.vue";
import Spinner from "../kit/Spinner.vue";
import ResourceCard from "../resource/ResourceCard.vue";
import {age} from "../format/time.js";
import {useNow} from "../composables/now.js";

const draft = reactive({text: "", files: [], sending: false, error: "", over: false});
const more = reactive({open: false, text: "", files: [], sending: false, error: ""});
const chosen = ref(0);
const composing = ref(false);

const joined = (d) => d.data?.queued_at || d.created;
const open = computed(() =>
    rows("dump")
        .filter((d) => !d.deleted && !d.completed)
        .sort((a, b) => joined(b) - joined(a) || b.n - a.n)
);
const inHand = computed(() => open.value[open.value.length - 1] || null);
const unconfirmed = computed(() =>
    rows("dump")
        .filter((d) => !d.deleted && d.completed && !d.data?.confirmed)
        .sort((a, b) => b.n - a.n)
);
const dump = computed(() =>
    composing.value ? null : rows("dump").find((d) => d.n === chosen.value) || inHand.value || unconfirmed.value[0] || null
);
watch(
    dump,
    (d) => {
        if (d && !chosen.value) chosen.value = d.n;
    },
    {immediate: true}
);

const names = (d) => [...(d.brief?.trim() ? ["text"] : []), ...Object.keys(d.data?.files || {}).sort()];
const items = computed(() =>
    dump.value
        ? names(dump.value).map((name) => {
              const item = (dump.value.data.items || {})[name] || {};
              const state = item.failed ? "failed" : item.outcome ? "filed" : item.insight ? "noted" : "waiting";
              return {name, state, ...item};
          })
        : []
);
const settled = computed(() => items.value.filter((i) => i.state === "filed" || i.state === "failed").length);
const working = computed(() => Boolean(dump.value && !dump.value.completed));
const queued = computed(() => Boolean(working.value && inHand.value && inHand.value.n !== dump.value.n));
const log = computed(() => dump.value?.data?.log || []);
const latest = computed(() => log.value[log.value.length - 1] || null);
const trail = computed(() => log.value.slice(-4, -1).reverse());
const progress = computed(() => (items.value.length ? settled.value / items.value.length : 0));

const now = useNow(3000);
const QUIET_AFTER = 180;
const started = computed(() => Boolean(log.value.length || items.value.some((i) => i.state !== "waiting")));
const quietFor = computed(() => (working.value && started.value && !queued.value ? now.value - (dump.value.updated || 0) : 0));
const quiet = computed(() => quietFor.value > QUIET_AFTER && !asked.value);
const status = computed(() => {
    if (queued.value) return `Waiting for dump ${inHand.value.n} to finish first`;
    if (!started.value) return "Waiting for the agent to pick this up";
    if (quiet.value) return `No update for ${Math.round(quietFor.value / 60)} min. The agent may be busy elsewhere`;
    return latest.value?.text || "Reading the items";
});

const filedRefs = computed(() => [...new Set(items.value.flatMap((i) => i.refs || []))]);
const writing = computed(() => (working.value && latest.value?.on && !filedRefs.value.includes(latest.value.on) ? latest.value.on : ""));
const drafts = reactive({});
const confirmed = computed(() => Boolean(dump.value?.data?.confirmed));
const madeRefs = computed(() =>
    [...filedRefs.value, ...(writing.value ? [writing.value] : [])].filter((ref) => !ref.startsWith("collection:"))
);
const made = computed(() =>
    madeRefs.value
        .map((ref) => {
            const [type, n] = ref.split(":");
            const row = rows(type).find((r) => r.n === Number(n)) || drafts[ref];
            return {ref, type, n: Number(n), row, writing: ref === writing.value};
        })
        .filter((m) => !m.row?.deleted)
);

async function fetchDrafts() {
    for (const ref of madeRefs.value) {
        const [type, n] = ref.split(":");
        if (rows(type).some((r) => r.n === Number(n))) continue;
        try {
            drafts[ref] = await api.show(type, Number(n));
        } catch {
            delete drafts[ref];
        }
    }
}
watch([madeRefs, now], fetchDrafts, {immediate: true});
const label = (name) => (name === "text" ? "Pasted text" : name.startsWith("added-") ? "Added note" : name);
const ITEM_STATES = {waiting: "waiting", noted: "reading", filed: "filed", failed: "not filed"};
const collection = computed(() => (dump.value?.refs || []).find((ref) => ref.startsWith("collection:")) || "");
const nextStep = computed(() =>
    dump.value ? rows("suggestion").find((s) => !s.deleted && !s.completed && s.refs.includes(dump.value.ref)) : null
);
const asked = computed(() => (working.value && dump.value.data?.question?.text) || "");
const SUGGESTING_FOR = 60;
const stopped = computed(() => Boolean(dump.value?.data?.stopped));
const suggesting = computed(() =>
    Boolean(dump.value?.completed && !stopped.value && !nextStep.value && now.value - dump.value.completed < SUGGESTING_FOR)
);
const unsuggested = computed(() => Boolean(dump.value?.completed && !stopped.value && !nextStep.value && !suggesting.value));
const finishedText = computed(() => {
    if (stopped.value) return dump.value.outcome;
    if (suggesting.value) return "Filed. Working out a next step…";
    return `Finished · ${dump.value.outcome}${unsuggested.value ? " · no next step suggested" : ""}`;
});
const stopping = ref(false);
const unfiled = computed(() => items.value.length - settled.value);
const reply = reactive({text: "", sending: false});
const stage = computed(() =>
    !dump.value
        ? ""
        : dump.value.completed
          ? dump.value.data?.stopped
              ? "Stopped"
              : "Filed"
          : queued.value
            ? "Queued"
            : asked.value
              ? "Needs you"
              : "Filing"
);

async function answer() {
    if (!reply.text.trim()) return;
    reply.sending = true;
    try {
        await api.act("dump", dump.value.n, "answer", {text: reply.text.trim()});
        reply.text = "";
    } finally {
        reply.sending = false;
    }
}

function added(into, list) {
    into.files = [...into.files, ...Array.from(list || [])];
}

function dropFiles(e) {
    draft.over = false;
    added(draft, e.dataTransfer?.files);
}

async function send() {
    const text = draft.text.trim();
    if (!text && !draft.files.length) return;
    draft.sending = true;
    draft.error = "";
    try {
        const made = await api.create("dump", text ? {brief: text} : {title: draft.files[0].name.slice(0, 80), brief: ""});
        for (const file of draft.files) await api.upload("dump", made.n, file);
        Object.assign(draft, {text: "", files: []});
        chosen.value = made.n;
        composing.value = false;
    } catch (e) {
        draft.error = e.message;
    } finally {
        draft.sending = false;
    }
}

async function addMore() {
    const text = more.text.trim();
    if (!text && !more.files.length) return;
    more.sending = true;
    more.error = "";
    try {
        const n = dump.value.n;
        if (dump.value.completed) await api.act("dump", n, "reopen", {why: "more was added"});
        const files = [...(text ? [new File([text], `added-${Date.now()}.md`, {type: "text/markdown"})] : []), ...more.files];
        for (const file of files) await api.upload("dump", n, file);
        Object.assign(more, {text: "", files: [], open: false});
    } catch (e) {
        more.error = e.message;
    } finally {
        more.sending = false;
    }
}

async function leaveOut(ref) {
    await api.act("dump", dump.value.n, "leave", {ref});
    delete drafts[ref];
}

async function finish() {
    if (!confirmed.value) return api.act("dump", dump.value.n, "confirm");
    store.dumping = false;
}

async function stop() {
    await api.act("dump", dump.value.n, "stop");
    stopping.value = false;
}

function fresh() {
    composing.value = true;
}

function follow(ref) {
    const [type, n] = ref.split(":");
    peek(type, Number(n));
}
</script>

<template>
    <section class="dump">
        <header class="dump-bar">
            <Icon name="inbox" :size="14" />
            <span class="dump-title">{{ dump ? `Dump ${dump.n} · ${dump.title}` : "New dump" }}</span>
            <template v-if="stage">
                <span :class="['dump-stage', stage.toLowerCase().replace(' ', '-')]">{{ stage }}</span>
            </template>
            <span class="grow" />
            <template v-if="dump">
                <Btn small @click="fresh">New dump</Btn>
            </template>
            <Btn small @click="store.dumping = false">Back to chat</Btn>
        </header>

        <template v-if="!dump">
            <div
                :class="['dump-drop', {over: draft.over}]"
                @dragover.prevent="draft.over = true"
                @dragleave="draft.over = false"
                @drop.prevent="dropFiles"
            >
                <textarea
                    v-model="draft.text"
                    placeholder="Paste anything here: a transcript, notes, a chat. Drop files anywhere in this box."
                />
                <template v-if="draft.files.length">
                    <ul class="dump-files">
                        <li v-for="(file, i) in draft.files" :key="file.name + i">
                            <Icon name="paperclip" :size="12" />
                            {{ file.name }}
                            <button type="button" class="dump-x" title="Leave this file out" @click="draft.files.splice(i, 1)">×</button>
                        </li>
                    </ul>
                </template>
                <div class="dump-foot">
                    <label class="dump-pick">
                        <Icon name="paperclip" :size="13" />
                        Add files
                        <input type="file" multiple hidden @change="added(draft, $event.target.files)" />
                    </label>
                    <span class="grow" />
                    <template v-if="draft.error">
                        <span class="dump-error">{{ draft.error }}</span>
                    </template>
                    <Btn kind="primary" small :disabled="draft.sending || (!draft.text.trim() && !draft.files.length)" @click="send">
                        {{ draft.sending ? "Dumping…" : "Dump" }}
                    </Btn>
                </div>
            </div>
        </template>

        <template v-else>
            <div class="dump-body">
                <div class="dump-dropped">
                    <h3 class="dump-heading">You dropped</h3>
                    <ul class="dump-inputs">
                        <li v-for="item in items" :key="item.name" :class="['dump-input', item.state]">
                            <span class="dump-dot" />
                            <span class="dump-input-text">
                                <span class="dump-input-head">
                                    <span class="dump-input-name">{{ label(item.name) }}</span>
                                    <span class="dump-input-state">{{ ITEM_STATES[item.state] }}</span>
                                </span>
                                <template v-if="item.failed || item.outcome || item.insight">
                                    <span class="dump-input-line">{{ item.failed || item.outcome || item.insight }}</span>
                                </template>
                                <template v-if="(item.refs || []).length">
                                    <span class="dump-input-refs">
                                        <a v-for="ref in item.refs" :key="ref" href="#" class="dump-link" @click.prevent="follow(ref)">
                                            {{ ref.replace(":", " ") }}
                                        </a>
                                    </span>
                                </template>
                            </span>
                        </li>
                    </ul>
                </div>

                <div :class="['dump-live', stage.toLowerCase().replace(' ', '-'), {quiet, unstarted: working && !started}]">
                    <div class="dump-live-line">
                        <template v-if="suggesting">
                            <Spinner />
                        </template>
                        <template v-else-if="stopped">
                            <Icon name="close" :size="14" />
                        </template>
                        <template v-else-if="dump.completed">
                            <Icon name="check" :size="14" />
                        </template>
                        <template v-else-if="queued || !started">
                            <Icon name="clock" :size="14" />
                        </template>
                        <template v-else-if="quiet">
                            <Icon name="help" :size="14" />
                        </template>
                        <template v-else-if="asked">
                            <Icon name="help" :size="14" />
                        </template>
                        <template v-else>
                            <Spinner />
                        </template>
                        <Transition name="dump-line" mode="out-in">
                            <span :key="dump.completed ? finishedText : status" class="dump-status-text">
                                {{ dump.completed ? finishedText : asked ? `The agent asks: ${asked}` : status }}
                            </span>
                        </Transition>
                        <template v-if="working && started && !quiet && !asked && latest">
                            <span class="dump-when">{{ age(latest.at) }}</span>
                        </template>
                        <span class="grow" />
                        <template v-if="quiet">
                            <button type="button" class="dump-stop-open" @click="store.dumping = false">Back to chat</button>
                        </template>
                        <template v-if="dump.completed">
                            <Btn kind="primary" small :disabled="suggesting && !confirmed" @click="finish">
                                {{ confirmed || !made.length ? "Done" : `Add ${made.length} to the journal` }}
                            </Btn>
                        </template>
                    </div>
                    <template v-if="asked">
                        <div class="dump-answer">
                            <textarea v-model="reply.text" placeholder="Your answer" @keydown.enter.exact.prevent="answer" />
                            <Btn kind="primary" small :disabled="reply.sending || !reply.text.trim()" @click="answer">
                                {{ reply.sending ? "Sending…" : "Answer" }}
                            </Btn>
                        </div>
                    </template>
                    <template v-if="working && !queued && trail.length">
                        <ul class="dump-trail">
                            <li v-for="entry in trail" :key="entry.at">{{ entry.text }}</li>
                        </ul>
                    </template>
                    <template v-if="!queued">
                        <div class="dump-progress">
                            <div class="dump-bar-track">
                                <div class="dump-bar-fill" :style="{width: `${Math.max(progress, 0.04) * 100}%`}" />
                            </div>
                            <span class="dump-count">{{ settled }} of {{ items.length }} filed</span>
                        </div>
                    </template>
                    <template v-if="working">
                        <div class="dump-stop">
                            <template v-if="!stopping">
                                <button type="button" class="dump-stop-open" @click="stopping = true">
                                    {{ queued ? "Remove from queue" : "Stop filing" }}
                                </button>
                            </template>
                            <template v-else>
                                <span>
                                    {{
                                        queued
                                            ? "Take this dump out of the queue? Nothing in it gets filed."
                                            : `Stop now? ${unfiled} ${unfiled === 1 ? "item" : "items"} not filed yet will be left out.`
                                    }}
                                </span>
                                <Btn small @click="stopping = false">Keep filing</Btn>
                                <Btn small class="dump-stop-yes" @click="stop">{{ queued ? "Remove" : "Stop" }}</Btn>
                            </template>
                        </div>
                    </template>
                    <template v-if="dump.completed && (collection || nextStep)">
                        <div class="dump-after">
                            <template v-if="collection">
                                <a href="#" class="dump-link" @click.prevent="follow(collection)">
                                    <Icon name="folder" :size="12" />
                                    Open its collection
                                </a>
                            </template>
                            <template v-if="nextStep">
                                <a href="#" class="dump-link" @click.prevent="follow(nextStep.ref)">
                                    <Icon name="arrow" :size="12" />
                                    Next step: {{ nextStep.title }}
                                </a>
                            </template>
                        </div>
                    </template>
                </div>

                <template v-if="made.length">
                    <h3 class="dump-heading">{{ working ? "Made so far" : "Made" }}</h3>
                    <TransitionGroup name="dump-pop" tag="div" class="dump-cards">
                        <div v-for="m in made" :key="m.ref" :class="['dump-card', {writing: m.writing}]">
                            <template v-if="m.row">
                                <ResourceCard :resource="m.row" @click="follow(m.ref)" />
                            </template>
                            <template v-else>
                                <button type="button" class="dump-card-empty" @click="follow(m.ref)">{{ m.type }} {{ m.n }}</button>
                            </template>
                            <template v-if="m.writing">
                                <span class="dump-writing">writing…</span>
                            </template>
                            <template v-else-if="!confirmed && m.row">
                                <button
                                    type="button"
                                    class="dump-leave"
                                    title="Delete this and keep it out of the record"
                                    @click="leaveOut(m.ref)"
                                >
                                    Leave out
                                </button>
                            </template>
                        </div>
                    </TransitionGroup>
                </template>

                <div class="dump-more">
                    <template v-if="!more.open">
                        <button type="button" class="dump-more-open" @click="more.open = true">
                            <Icon name="plus" :size="12" />
                            Add more to this dump
                        </button>
                    </template>
                    <template v-else>
                        <textarea v-model="more.text" placeholder="Something you forgot: more text, or drop files below." />
                        <template v-if="more.files.length">
                            <ul class="dump-files">
                                <li v-for="(file, i) in more.files" :key="file.name + i">
                                    <Icon name="paperclip" :size="12" />
                                    {{ file.name }}
                                    <button type="button" class="dump-x" title="Leave this file out" @click="more.files.splice(i, 1)">
                                        ×
                                    </button>
                                </li>
                            </ul>
                        </template>
                        <div class="dump-foot">
                            <label class="dump-pick">
                                <Icon name="paperclip" :size="13" />
                                Add files
                                <input type="file" multiple hidden @change="added(more, $event.target.files)" />
                            </label>
                            <span class="grow" />
                            <template v-if="more.error">
                                <span class="dump-error">{{ more.error }}</span>
                            </template>
                            <Btn small @click="more.open = false">Cancel</Btn>
                            <Btn
                                kind="primary"
                                small
                                :disabled="more.sending || (!more.text.trim() && !more.files.length)"
                                @click="addMore"
                            >
                                {{ more.sending ? "Adding…" : "Add" }}
                            </Btn>
                        </div>
                    </template>
                </div>
            </div>
        </template>
    </section>
</template>

<style scoped>
.dump {
    display: flex;
    flex-direction: column;
    height: 100%;
    min-height: 0;
}

.dump-bar {
    display: flex;
    align-items: center;
    gap: 8px;
    padding: 10px 4px;
    border-bottom: 1px solid var(--border);
    color: var(--text-2);
    font-size: 13px;
}

.dump-title {
    overflow: hidden;
    color: var(--text);
    font-weight: 500;
    white-space: nowrap;
    text-overflow: ellipsis;
}

.dump-stage {
    flex: none;
    padding: 1px 7px;
    border-radius: 999px;
    background: var(--hover);
    color: var(--text-2);
    font-size: 11px;
}

.dump-stage.filed {
    background: color-mix(in srgb, var(--created) 16%, transparent);
    color: var(--created);
}

.grow {
    flex: 1;
}

.dump-drop {
    display: flex;
    flex: 1;
    flex-direction: column;
    gap: 10px;
    margin: 12px 0;
    padding: 12px;
    border: 1px dashed var(--border-2);
    border-radius: 12px;
    background: var(--raised);
}

.dump-drop.over {
    border-color: var(--accent);
}

.dump-drop textarea,
.dump-more textarea {
    flex: 1;
    min-height: 200px;
    border: none;
    background: transparent;
    color: var(--text);
    font: inherit;
    font-size: 14px;
    line-height: 1.55;
    resize: none;
    outline: none;
}

.dump-more textarea {
    min-height: 70px;
}

.dump-files {
    display: flex;
    flex-wrap: wrap;
    gap: 6px;
    margin: 0;
    padding: 0;
    list-style: none;
}

.dump-files li {
    display: inline-flex;
    align-items: center;
    gap: 5px;
    padding: 3px 8px;
    border: 1px solid var(--border);
    border-radius: 6px;
    color: var(--text-2);
    font-size: 12px;
}

.dump-x {
    border: none;
    background: none;
    color: var(--text-3);
    cursor: pointer;
}

.dump-foot {
    display: flex;
    align-items: center;
    gap: 10px;
}

.dump-pick {
    display: inline-flex;
    align-items: center;
    gap: 5px;
    color: var(--text-2);
    font-size: 12.5px;
    cursor: pointer;
}

.dump-error {
    color: var(--danger);
    font-size: 12px;
}

.dump-body {
    display: flex;
    flex-direction: column;
    gap: 14px;
    padding: 14px 0;
    overflow-y: auto;
}

.dump-heading {
    margin: 0;
    color: var(--text-3);
    font-size: 11px;
    font-weight: 500;
    letter-spacing: 0.04em;
    text-transform: uppercase;
}

.dump-live {
    display: flex;
    flex-direction: column;
    gap: 10px;
    padding: 12px 14px;
    border: 1px solid var(--border);
    border-radius: 10px;
    background: var(--raised);
    color: var(--text-2);
    font-size: 13px;
}

.dump-live-line {
    display: flex;
    align-items: center;
    gap: 8px;
    min-height: 26px;
    color: var(--text);
    font-size: 13.5px;
    font-weight: 500;
}

.dump-live-line :deep(.spinner) {
    color: var(--accent);
}

.dump-live.filed .dump-live-line > :first-child {
    color: var(--created);
}

.dump-live.queued .dump-live-line {
    color: var(--text-2);
}

.dump-status-text {
    display: inline-block;
}

.dump-status-text::first-letter {
    text-transform: uppercase;
}

.dump-stage.needs-you {
    background: color-mix(in srgb, var(--blocking) 16%, transparent);
    color: var(--blocking);
}

.dump-live.needs-you {
    border-color: color-mix(in srgb, var(--blocking) 45%, var(--border));
}

.dump-live.needs-you .dump-live-line > :first-child {
    color: var(--blocking);
}

.dump-answer {
    display: flex;
    align-items: flex-end;
    gap: 8px;
}

.dump-answer textarea {
    flex: 1;
    min-height: 38px;
    padding: 8px 10px;
    border: 1px solid var(--border-2);
    border-radius: 8px;
    background: var(--bg);
    color: var(--text);
    font: inherit;
    font-size: 13px;
    resize: vertical;
    outline: none;
}

.dump-live.filed .dump-live-line > :first-child.spinner {
    color: var(--accent);
}

.dump-stop {
    display: flex;
    align-items: center;
    justify-content: flex-end;
    gap: 8px;
    color: var(--text-2);
    font-size: 12px;
}

.dump-stop span {
    flex: 1;
}

.dump-stop-open {
    padding: 0;
    border: none;
    background: none;
    color: var(--text-3);
    font-size: 12px;
    cursor: pointer;
}

.dump-stop-open:hover {
    color: var(--text);
}

.dump-stop-yes {
    border-color: var(--danger);
    color: var(--danger);
}

.dump-inputs {
    display: flex;
    flex-direction: column;
    gap: 8px;
    margin: 6px 0 0;
    padding: 0;
    list-style: none;
}

.dump-input {
    display: flex;
    gap: 9px;
    font-size: 13px;
}

.dump-dot {
    flex: none;
    width: 6px;
    height: 6px;
    margin-top: 6px;
    border-radius: 50%;
    background: var(--text-3);
}

.dump-input.noted .dump-dot {
    background: var(--accent);
    animation: dump-pulse 1.4s ease-in-out infinite;
}

.dump-input.filed .dump-dot {
    background: var(--created);
}

.dump-input.failed .dump-dot {
    background: var(--danger);
}

.dump-input-text {
    display: flex;
    flex-direction: column;
    gap: 2px;
    min-width: 0;
}

.dump-input-head {
    display: flex;
    align-items: baseline;
    gap: 8px;
}

.dump-input-name {
    overflow: hidden;
    color: var(--text);
    white-space: nowrap;
    text-overflow: ellipsis;
}

.dump-input-state {
    flex: none;
    color: var(--text-3);
    font-size: 11.5px;
}

.dump-input.failed .dump-input-state {
    color: var(--danger);
}

.dump-input-line {
    color: var(--text-2);
    font-size: 12.5px;
}

.dump-input-refs {
    display: flex;
    flex-wrap: wrap;
    gap: 8px;
}

@keyframes dump-pulse {
    50% {
        opacity: 0.35;
    }
}

.dump-when {
    flex: none;
    color: var(--text-3);
    font-size: 12px;
    font-weight: 400;
}

.dump-live.quiet {
    border-color: color-mix(in srgb, var(--blocking) 45%, var(--border));
}

.dump-live.quiet .dump-live-line > :first-child {
    color: var(--blocking);
}

.dump-live.unstarted .dump-live-line {
    color: var(--text-2);
}

.dump-trail {
    display: flex;
    flex-direction: column;
    gap: 2px;
    margin: 0;
    padding: 0 0 0 17px;
    color: var(--text-3);
    font-size: 12px;
    list-style: none;
}

.dump-progress {
    display: flex;
    align-items: center;
    gap: 10px;
}

.dump-bar-track {
    flex: 1;
    height: 3px;
    overflow: hidden;
    border-radius: 2px;
    background: var(--border);
}

.dump-bar-fill {
    height: 100%;
    border-radius: 2px;
    background: var(--accent);
    transition: width 0.4s ease;
}

.dump-count {
    flex: none;
    color: var(--text-3);
    font-size: 12px;
}

.dump-after {
    display: flex;
    flex-wrap: wrap;
    gap: 14px;
}

.dump-link {
    display: inline-flex;
    align-items: center;
    gap: 5px;
    color: var(--accent-text);
    font-size: 12.5px;
}

.dump-cards {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(220px, 1fr));
    gap: 12px;
}

.dump-card {
    position: relative;
    display: grid;
}

.dump-card.writing :deep(.card) {
    border-color: color-mix(in srgb, var(--accent) 50%, var(--border));
}

.dump-card.writing::after {
    position: absolute;
    inset: 0;
    border-radius: 10px;
    background: linear-gradient(100deg, transparent 20%, color-mix(in srgb, var(--accent) 14%, transparent) 50%, transparent 80%);
    background-size: 200% 100%;
    animation: dump-shimmer 1.8s ease-in-out infinite;
    content: "";
    pointer-events: none;
}

.dump-card.writing :deep(.age) {
    visibility: hidden;
}

.dump-writing {
    position: absolute;
    top: 15px;
    right: 16px;
    color: var(--accent-text);
    font-size: 12px;
}

.dump-leave {
    position: absolute;
    right: 10px;
    bottom: 8px;
    padding: 2px 8px;
    border: 1px solid var(--border);
    border-radius: 6px;
    background: var(--raised);
    color: var(--text-2);
    font-size: 11.5px;
    opacity: 0;
    cursor: pointer;
    transition: opacity 0.15s ease;
}

.dump-card:hover .dump-leave,
.dump-leave:focus-visible {
    opacity: 1;
}

.dump-leave:hover {
    border-color: var(--danger);
    color: var(--danger);
}

.dump-card-empty {
    min-height: 130px;
    border: 1px solid var(--border);
    border-radius: 10px;
    background: var(--raised);
    color: var(--text-2);
    cursor: pointer;
}

.dump-more {
    display: flex;
    flex-direction: column;
    gap: 8px;
}

.dump-more:has(textarea) {
    padding: 10px 12px;
    border: 1px dashed var(--border-2);
    border-radius: 10px;
}

.dump-more-open {
    display: inline-flex;
    align-self: flex-start;
    align-items: center;
    gap: 5px;
    padding: 0;
    border: none;
    background: none;
    color: var(--text-2);
    font-size: 12.5px;
    cursor: pointer;
}

.dump-more-open:hover {
    color: var(--text);
}

@keyframes dump-shimmer {
    from {
        background-position: 130% 0;
    }

    to {
        background-position: -30% 0;
    }
}

@media (prefers-reduced-motion: reduce) {
    .dump-card.writing::after {
        opacity: 0.5;
        animation: none;
    }

    .dump-pop-enter-active {
        transition: opacity 0.2s ease;
    }

    .dump-pop-enter-from {
        transform: none;
    }
}

.dump-pop-enter-active {
    transition:
        opacity 0.3s ease,
        transform 0.35s cubic-bezier(0.2, 1.1, 0.4, 1);
}

.dump-pop-enter-from {
    opacity: 0;
    transform: scale(0.96) translateY(6px);
}

.dump-line-enter-active,
.dump-line-leave-active {
    transition: opacity 0.25s ease;
}

.dump-line-enter-from,
.dump-line-leave-to {
    opacity: 0;
}

.dump-enter-active,
.dump-leave-active {
    transition:
        opacity 0.2s ease,
        transform 0.24s cubic-bezier(0.2, 0.8, 0.2, 1);
}

.dump-leave-active {
    position: absolute;
    inset: 0;
    z-index: 2;
    background: var(--bg);
}

.dump-enter-from,
.dump-leave-to {
    opacity: 0;
    transform: translateY(8px);
}
</style>
