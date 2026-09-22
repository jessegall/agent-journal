<script setup>
import {computed, reactive, ref} from "vue";
import {api} from "../api/client.js";
import {store} from "../state/store.js";
import {rows} from "../sync/rows.js";
import {peek} from "../route.js";
import Icon from "../kit/Icon.vue";
import Btn from "../kit/Btn.vue";
import Markdown from "../resource/Markdown.vue";

const draft = reactive({text: "", files: [], sending: false, error: "", over: false});
const chosen = ref(0);
const composing = ref(false);

const open = computed(() =>
    rows("dump")
        .filter((d) => !d.deleted && !d.completed)
        .sort((a, b) => b.n - a.n)
);
const dump = computed(() => (composing.value ? null : rows("dump").find((d) => d.n === chosen.value) || open.value[0] || null));

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
const left = computed(() => items.value.filter((i) => i.state === "waiting" || i.state === "noted").length);
const collection = computed(() => (dump.value?.refs || []).find((ref) => ref.startsWith("collection:")) || "");
const nextStep = computed(() =>
    dump.value ? rows("suggestion").find((s) => !s.deleted && !s.completed && s.refs.includes(dump.value.ref)) : null
);

function added(list) {
    draft.files = [...draft.files, ...Array.from(list || [])];
}

function dropped(e) {
    draft.over = false;
    added(e.dataTransfer?.files);
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
                @drop.prevent="dropped"
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
                        <input type="file" multiple hidden @change="added($event.target.files)" />
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
            <div class="dump-items">
                <p class="dump-status">
                    <template v-if="dump.completed">{{ dump.outcome }}</template>
                    <template v-else>{{ left }} of {{ items.length }} still being filed</template>
                    <template v-if="collection">
                        ·
                        <a href="#" class="dump-link" @click.prevent="follow(collection)">open its collection</a>
                    </template>
                </p>
                <template v-for="item in items" :key="item.name">
                    <article :class="['dump-item', item.state]">
                        <header class="dump-item-head">
                            <Icon :name="item.name === 'text' ? 'file' : 'paperclip'" :size="12" />
                            <span class="dump-item-name">{{ item.name === "text" ? "The pasted text" : item.name }}</span>
                            <span class="grow" />
                            <span class="dump-state">{{ item.state }}</span>
                        </header>
                        <template v-if="item.insight">
                            <Markdown class="dump-line" :text="item.insight" />
                        </template>
                        <template v-if="item.outcome">
                            <Markdown class="dump-line outcome" :text="item.outcome" />
                        </template>
                        <template v-if="item.failed">
                            <Markdown class="dump-line failed" :text="item.failed" />
                        </template>
                        <template v-if="(item.refs || []).length">
                            <div class="dump-refs">
                                <a v-for="ref in item.refs" :key="ref" href="#" class="dump-link" @click.prevent="follow(ref)">
                                    {{ ref.replace(":", " ") }}
                                </a>
                            </div>
                        </template>
                    </article>
                </template>
                <template v-if="nextStep">
                    <article class="dump-next">
                        <span class="dump-state">next step</span>
                        <a href="#" class="dump-link" @click.prevent="follow(nextStep.ref)">{{ nextStep.title }}</a>
                    </article>
                </template>
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
    color: var(--text);
    font-weight: 500;
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

.dump-drop textarea {
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

.dump-items {
    display: flex;
    flex-direction: column;
    gap: 10px;
    padding: 12px 0;
    overflow-y: auto;
}

.dump-status {
    margin: 0 0 4px;
    color: var(--text-2);
    font-size: 13px;
}

.dump-item {
    padding: 10px 12px;
    border: 1px solid var(--border);
    border-left: 3px solid var(--border-2);
    border-radius: 8px;
    background: var(--raised);
}

.dump-item.noted {
    border-left-color: var(--progress);
}

.dump-item.filed {
    border-left-color: var(--accent);
}

.dump-item.failed {
    border-left-color: var(--blocking);
}

.dump-item-head {
    display: flex;
    align-items: center;
    gap: 6px;
    color: var(--text);
    font-size: 13px;
}

.dump-state {
    color: var(--text-3);
    font-size: 11px;
    letter-spacing: 0.04em;
    text-transform: uppercase;
}

.dump-line {
    margin-top: 6px;
    font-size: 13px;
}

.dump-line.failed {
    color: var(--blocking);
}

.dump-refs {
    display: flex;
    flex-wrap: wrap;
    gap: 8px;
    margin-top: 6px;
}

.dump-link {
    color: var(--accent-text);
    font-size: 12.5px;
}

.dump-next {
    display: flex;
    align-items: center;
    gap: 10px;
    padding: 10px 12px;
    border: 1px solid var(--accent);
    border-radius: 8px;
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
