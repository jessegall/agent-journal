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
import {phrase} from "../layout/statusline.js";
import {useNow} from "../composables/now.js";

const draft = reactive({text: "", files: [], sending: false, error: "", over: false});
const more = reactive({open: false, text: "", files: [], sending: false, error: ""});
const chosen = ref(0);
const composing = ref(false);

const open = computed(() =>
    rows("dump")
        .filter((d) => !d.deleted && !d.completed)
        .sort((a, b) => b.n - a.n)
);
const inHand = computed(() => open.value[open.value.length - 1] || null);
const dump = computed(() => (composing.value ? null : rows("dump").find((d) => d.n === chosen.value) || inHand.value));
watch(dump, (d) => {
    if (d && !chosen.value) chosen.value = d.n;
});

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
const failures = computed(() => items.value.filter((i) => i.state === "failed"));
const working = computed(() => Boolean(dump.value && !dump.value.completed));
const queued = computed(() => Boolean(working.value && inHand.value && inHand.value.n !== dump.value.n));
const log = computed(() => dump.value?.data?.log || []);
const latest = computed(() => log.value[log.value.length - 1] || null);
const trail = computed(() => log.value.slice(-4, -1).reverse());
const progress = computed(() => (items.value.length ? settled.value / items.value.length : 0));

const now = useNow(3000);
const activity = computed(() => {
    const queue = store.bar?.queue || [];
    const last = queue[queue.length - 1];
    return last && !last.done ? last.key : "";
});
const status = computed(() => {
    if (queued.value) return `Waiting in line. The agent finishes dump ${inHand.value.n} first.`;
    return latest.value?.text || activity.value || phrase("filing", now.value / 3);
});

const filedRefs = computed(() => [...new Set(items.value.flatMap((i) => i.refs || []))]);
const writing = computed(() => (working.value && latest.value?.on && !filedRefs.value.includes(latest.value.on) ? latest.value.on : ""));
const made = computed(() =>
    [...filedRefs.value, ...(writing.value ? [writing.value] : [])]
        .filter((ref) => !ref.startsWith("collection:"))
        .map((ref) => {
            const [type, n] = ref.split(":");
            return {ref, type, n: Number(n), row: rows(type).find((r) => r.n === Number(n)), writing: ref === writing.value};
        })
);
const label = (name) => (name === "text" ? "the pasted text" : name.startsWith("added-") ? "a note you added" : name);
const dropped = computed(() => items.value.map((i) => label(i.name)));
const collection = computed(() => (dump.value?.refs || []).find((ref) => ref.startsWith("collection:")) || "");
const nextStep = computed(() =>
    dump.value ? rows("suggestion").find((s) => !s.deleted && !s.completed && s.refs.includes(dump.value.ref)) : null
);
const stage = computed(() => (!dump.value ? "" : dump.value.completed ? "Filed" : queued.value ? "Queued" : "Filing"));

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

async function finish() {
    if (working.value) await api.act("dump", dump.value.n, "close", {how: "closed by the user"});
    store.dumping = false;
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
                <span :class="['dump-stage', stage.toLowerCase()]">{{ stage }}</span>
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
                <p class="dump-dropped">
                    <span class="dump-label">You dropped</span>
                    <span v-for="(name, i) in dropped" :key="i" class="dump-chip">{{ name }}</span>
                </p>

                <div :class="['dump-live', stage.toLowerCase()]">
                    <div class="dump-live-line">
                        <template v-if="dump.completed">
                            <Icon name="check" :size="14" />
                        </template>
                        <template v-else-if="queued">
                            <Icon name="clock" :size="13" />
                        </template>
                        <template v-else>
                            <Spinner />
                        </template>
                        <Transition name="dump-line" mode="out-in">
                            <span :key="dump.completed ? 'filed' : status">
                                {{ dump.completed ? `Finished · ${dump.outcome}` : status }}
                            </span>
                        </Transition>
                        <span class="grow" />
                        <Btn :kind="dump.completed ? 'primary' : undefined" small @click="finish">
                            {{ dump.completed ? "Done" : "Mark done" }}
                        </Btn>
                    </div>
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
                    <h3 class="dump-heading">What it made</h3>
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
                        </div>
                    </TransitionGroup>
                </template>

                <template v-if="failures.length">
                    <ul class="dump-failures">
                        <li v-for="f in failures" :key="f.name">
                            <Icon name="x" :size="12" />
                            {{ label(f.name) }} was not filed: {{ f.failed }}
                        </li>
                    </ul>
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

.dump-stage.filing {
    background: color-mix(in srgb, var(--accent) 18%, transparent);
    color: var(--accent-text);
}

.dump-stage.filed {
    background: color-mix(in srgb, var(--done, #3fb950) 18%, transparent);
    color: var(--done, #3fb950);
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

.dump-files li,
.dump-chip {
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

.dump-dropped {
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    gap: 6px;
    margin: 0;
}

.dump-label,
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

.dump-live.filing {
    border-color: color-mix(in srgb, var(--accent) 40%, var(--border));
}

.dump-live-line {
    display: flex;
    align-items: center;
    gap: 8px;
    min-height: 26px;
    color: var(--accent-text);
    font-size: 13.5px;
}

.dump-live.queued .dump-live-line {
    color: var(--text-2);
}

.dump-live.filed .dump-live-line {
    color: var(--text);
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
    animation: dump-shimmer 1.6s linear infinite;
    content: "";
    pointer-events: none;
}

.dump-writing {
    position: absolute;
    right: 12px;
    bottom: 10px;
    color: var(--accent-text);
    font-size: 11px;
}

.dump-card-empty {
    min-height: 130px;
    border: 1px solid var(--border);
    border-radius: 10px;
    background: var(--raised);
    color: var(--text-2);
    cursor: pointer;
}

.dump-failures {
    display: flex;
    flex-direction: column;
    gap: 4px;
    margin: 0;
    padding: 0;
    color: var(--blocking);
    font-size: 12.5px;
    list-style: none;
}

.dump-failures li {
    display: flex;
    align-items: center;
    gap: 6px;
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
        background-position: 200% 0;
    }

    to {
        background-position: -200% 0;
    }
}

.dump-pop-enter-active {
    transition:
        opacity 0.3s ease,
        transform 0.35s cubic-bezier(0.2, 1.4, 0.4, 1);
}

.dump-pop-enter-from {
    opacity: 0;
    transform: scale(0.92) translateY(6px);
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
