<script setup>
import {computed, reactive, ref, watch, watchEffect} from "vue";
import {api} from "../api/client.js";
import Btn from "../kit/Btn.vue";
import CommentToggle from "./CommentToggle.vue";
import Icon from "../kit/Icon.vue";
import {age} from "../format/time.js";
import {sectionChanges} from "../domain/diff.js";
import {useNow} from "../composables/now.js";
import Markdown from "./Markdown.vue";

const props = defineProps({resource: Object});
const emit = defineEmits(["close"]);
const numbers = computed(() => props.resource.data.revisions || []);
const at = ref(-1);
const revisions = reactive({});
const changes = ref(true);
const error = ref("");
const editing = ref("");
const draft = reactive({title: "", abstract: "", brief: "", part: "", body: ""});

watch(
    numbers,
    (now, before) => {
        if (at.value < 0 || !before || at.value >= before.length - 1) at.value = now.length - 1;
    },
    {immediate: true}
);

async function fetchRevision(n) {
    if (!n || revisions[n]) return;
    try {
        revisions[n] = await api.show("doc", n);
    } catch (e) {
        error.value = e.message;
    }
}

const now = useNow(15000);
const open = computed(() => Number(props.resource.data.open_until || 0) > now.value);
const minutesLeft = computed(() => Math.max(1, Math.ceil((Number(props.resource.data.open_until || 0) - now.value) / 60)));

watch(
    () => props.resource.updated,
    () => {
        const n = numbers.value[numbers.value.length - 1];
        if (n && revisions[n]) delete revisions[n];
    }
);

watchEffect(() => {
    fetchRevision(numbers.value[at.value]);
    fetchRevision(numbers.value[at.value - 1]);
});

const latest = computed(() => at.value === numbers.value.length - 1);
const shown = computed(() => (latest.value ? props.resource : revisions[numbers.value[at.value]]) || null);
const meta = computed(() => revisions[numbers.value[at.value]] || null);
const previous = computed(() => (at.value > 0 ? revisions[numbers.value[at.value - 1]] || null : null));
const comparing = computed(() => changes.value && at.value > 0 && !!previous.value);
const parts = computed(() =>
    comparing.value
        ? sectionChanges(previous.value.sections, shown.value.sections)
        : (shown.value?.sections || []).map((s) => ({...s, kind: "same", lines: []}))
);
const topChanged = computed(() =>
    comparing.value
        ? {
              title: previous.value.title !== shown.value.title,
              abstract: previous.value.abstract !== shown.value.abstract,
              brief: previous.value.brief !== shown.value.brief,
          }
        : {}
);

const status = computed(() => (latest.value && open.value ? `Open for edits, kept by itself in ${minutesLeft.value} min` : ""));
const note = computed(() =>
    [
        status.value,
        meta.value ? meta.value.data.change : "",
        meta.value ? meta.value.seen.join(", ") : "",
        meta.value ? age(meta.value.updated || meta.value.created) || "just now" : "",
    ]
        .filter(Boolean)
        .join(" · ")
);

const WINDOW = 8;
const ticks = computed(() => {
    const from = Math.max(0, Math.min(at.value - WINDOW + 2, numbers.value.length - WINDOW));
    return {from, shown: Array.from({length: Math.min(WINDOW, numbers.value.length)}, (_, k) => from + k)};
});

function go(i) {
    at.value = Math.max(0, Math.min(numbers.value.length - 1, i));
    editing.value = "";
}

async function run(action, body) {
    error.value = "";
    try {
        await api.act("design", props.resource.n, action, body);
        editing.value = "";
        return true;
    } catch (e) {
        error.value = e.message;
        return false;
    }
}

function editTop() {
    Object.assign(draft, {title: props.resource.title, abstract: props.resource.abstract, brief: props.resource.brief});
    editing.value = "top";
}

function editPart(part) {
    Object.assign(draft, {part: part.title, body: part.body});
    editing.value = `part:${part.title}`;
}

function addPart() {
    Object.assign(draft, {part: "", body: ""});
    editing.value = "new";
}

const saveTop = () => run("update", {title: draft.title.trim(), abstract: draft.abstract.trim(), brief: draft.brief});
const savePart = () => draft.part.trim() && run("section", {title: draft.part.trim(), body: draft.body});
const cutPart = (title) => run("cut", {title});
</script>

<template>
    <article class="body design">
        <header class="top">
            <span class="kind">
                <Icon name="revisions" :size="13" />
                Design {{ resource.n }}
            </span>
            <span class="grow" />
            <CommentToggle />
            <Btn kind="icon" @click="emit('close')"><Icon name="x" /></Btn>
        </header>

        <nav class="revisions" aria-label="Revisions">
            <div class="steps">
                <template v-if="numbers.length > 1">
                    <Btn kind="icon" small :disabled="at <= 0" title="Earlier revision" @click="go(at - 1)">
                        <Icon name="chevron" class="back" />
                    </Btn>
                    <template v-if="ticks.from > 0">
                        <span class="earlier">+{{ ticks.from }}</span>
                    </template>
                    <template v-for="i in ticks.shown" :key="numbers[i]">
                        <button
                            type="button"
                            :class="['tick', {current: i === at, open: open && i === numbers.length - 1}]"
                            :title="open && i === numbers.length - 1 ? `Revision ${i + 1}, open for edits` : `Revision ${i + 1}`"
                            :aria-current="i === at ? 'true' : undefined"
                            @click="go(i)"
                        />
                    </template>
                    <Btn kind="icon" small :disabled="latest" title="Later revision" @click="go(at + 1)">
                        <Icon name="chevron" />
                    </Btn>
                    <span class="count">Revision {{ at + 1 }} of {{ numbers.length }}</span>
                </template>
                <template v-else>
                    <span class="count">{{ status || "Kept" }}</span>
                </template>
                <span class="grow" />
                <template v-if="latest && open">
                    <Btn small title="Keep this revision as it is; the next edit starts a new one" @click="run('keep', {})">
                        Keep this revision
                    </Btn>
                </template>
                <template v-if="at > 0">
                    <button type="button" :class="['switch', {on: changes}]" :aria-pressed="changes" @click="changes = !changes">
                        Show changes
                    </button>
                </template>
                <template v-if="!latest">
                    <Btn small @click="go(numbers.length - 1)">Latest</Btn>
                </template>
            </div>
            <template v-if="numbers.length > 1">
                <p class="where">{{ note }}</p>
            </template>
        </nav>

        <template v-if="!shown">
            <div class="skeleton">
                <span class="blank wide" />
                <span class="blank" />
                <span class="blank half" />
            </div>
        </template>
        <template v-else-if="editing === 'top'">
            <form class="edit" @submit.prevent="saveTop">
                <input v-model="draft.title" class="edit-title" maxlength="80" placeholder="Title, at most 80 characters" />
                <textarea v-model="draft.abstract" rows="2" maxlength="200" placeholder="Abstract, at most 200 characters" />
                <textarea v-model="draft.brief" rows="6" placeholder="Brief" />
                <div class="edit-row">
                    <Btn kind="primary" small @click="saveTop">Save as a new revision</Btn>
                    <Btn small @click="editing = ''">Cancel</Btn>
                </div>
            </form>
        </template>
        <template v-else>
            <h2 :class="['title', {changed: topChanged.title}]">{{ shown.title }}</h2>
            <template v-if="shown.abstract">
                <Markdown :class="['abstract', {changed: topChanged.abstract}]" :text="shown.abstract" />
            </template>
            <template v-if="shown.brief">
                <Markdown :class="['brief', {changed: topChanged.brief}]" :text="shown.brief" />
            </template>
            <template v-if="latest">
                <div class="actions">
                    <Btn small @click="editTop">
                        <Icon name="pencil" />
                        Edit the top
                    </Btn>
                    <Btn small @click="addPart">
                        <Icon name="plus" />
                        Add a part
                    </Btn>
                </div>
            </template>
        </template>

        <span class="error">{{ error }}</span>

        <template v-if="shown">
            <template v-for="part in parts" :key="part.title">
                <section :class="['part', part.kind]">
                    <template v-if="editing === `part:${part.title}`">
                        <form class="edit" @submit.prevent="savePart">
                            <input v-model="draft.part" class="edit-part" placeholder="Part title" readonly />
                            <textarea v-model="draft.body" rows="12" placeholder="What this part says" />
                            <div class="edit-row">
                                <Btn kind="primary" small @click="savePart">Save as a new revision</Btn>
                                <Btn small @click="editing = ''">Cancel</Btn>
                            </div>
                        </form>
                    </template>
                    <template v-else>
                        <header class="part-head">
                            <h3>{{ part.title }}</h3>
                            <template v-if="part.kind !== 'same'">
                                <span class="badge">{{ part.kind }}</span>
                            </template>
                            <span class="grow" />
                            <template v-if="latest && part.kind !== 'removed'">
                                <Btn kind="icon" small title="Edit this part" @click="editPart(part)"><Icon name="pencil" /></Btn>
                                <Btn kind="icon" small title="Cut this part" @click="cutPart(part.title)"><Icon name="x" /></Btn>
                            </template>
                        </header>
                        <template v-if="part.kind === 'changed'">
                            <pre
                                class="diff"
                            ><template v-for="(line, i) in part.lines" :key="i"><span :class="['line', line.kind]">{{ line.text || " " }}</span></template></pre>
                        </template>
                        <template v-else>
                            <Markdown :text="part.body" />
                        </template>
                    </template>
                </section>
            </template>
        </template>

        <template v-if="editing === 'new'">
            <form class="edit part" @submit.prevent="savePart">
                <input v-model="draft.part" class="edit-part" placeholder="Part title" />
                <textarea v-model="draft.body" rows="10" placeholder="What this part says" />
                <div class="edit-row">
                    <Btn kind="primary" small @click="savePart">Add as a new revision</Btn>
                    <Btn small @click="editing = ''">Cancel</Btn>
                </div>
            </form>
        </template>
    </article>
</template>

<style scoped>
.top {
    display: flex;
    align-items: center;
    gap: 12px;
    color: var(--text-3);
    font-size: 11.5px;
    text-transform: uppercase;
    letter-spacing: 0.04em;
}

.kind {
    display: inline-flex;
    align-items: center;
    gap: 6px;
    color: var(--accent-text);
}

.grow {
    flex: 1;
}

.revisions {
    margin: 12px 0 6px;
    padding: 8px 10px;
    border: 1px solid var(--border);
    border-radius: 10px;
    background: var(--raised);
    font-size: 12px;
    color: var(--text-3);
}

.steps {
    display: flex;
    align-items: center;
    gap: 4px;
}

.earlier {
    margin-right: 2px;
    font-size: 11px;
    color: var(--text-3);
}

.count {
    margin-left: 6px;
    white-space: nowrap;
    color: var(--text-2);
}

.back {
    transform: rotate(180deg);
}

.tick {
    flex: none;
    margin: 0 1px;
    width: 8px;
    height: 16px;
    padding: 0;
    border: none;
    border-radius: 3px;
    background: var(--border-2);
    cursor: pointer;
}

.tick:hover {
    background: var(--text-3);
}

.tick.current {
    background: var(--accent);
}

.tick.open {
    background: transparent;
    box-shadow: inset 0 0 0 1.5px var(--text-3);
}

.tick.open.current {
    box-shadow: inset 0 0 0 1.5px var(--accent);
}

.where {
    margin: 6px 0 0 4px;
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
}

.switch {
    flex: none;
    white-space: nowrap;
    height: 24px;
    padding: 0 9px;
    border: 1px solid var(--border-2);
    border-radius: 6px;
    background: transparent;
    color: var(--text-3);
    font-size: 11.5px;
    cursor: pointer;
}

.switch.on {
    border-color: var(--accent);
    color: var(--accent-text);
}

.title {
    margin: 12px 0 4px;
    font-size: 22px;
    font-weight: 600;
}

.abstract,
.brief {
    margin: 0 0 10px;
    color: var(--text-2);
}

.changed {
    border-left: 2px solid var(--progress);
    padding-left: 8px;
}

.actions {
    display: flex;
    gap: 8px;
    margin: 6px 0 12px;
}

.error {
    display: block;
    color: var(--danger);
    font-size: 12px;
}

.part {
    margin-top: 14px;
    padding-left: 10px;
    border-left: 2px solid transparent;
}

.part.added {
    border-left-color: var(--progress);
}

.part.changed {
    border-left-color: var(--accent);
}

.part.removed {
    border-left-color: var(--danger);
    opacity: 0.6;
}

.part.removed h3 {
    text-decoration: line-through;
}

.part-head {
    display: flex;
    align-items: center;
    gap: 8px;
}

.part-head h3 {
    margin: 0 0 4px;
    font-size: 13px;
    font-weight: 600;
    color: var(--text);
}

.badge {
    font-size: 10.5px;
    text-transform: uppercase;
    letter-spacing: 0.05em;
    color: var(--text-3);
}

.diff {
    margin: 4px 0 0;
    font-family: inherit;
    font-size: 13px;
    line-height: 1.55;
    white-space: pre-wrap;
}

.line {
    display: block;
    padding: 0 6px;
    border-radius: 3px;
    color: var(--text-2);
}

.line.added {
    background: color-mix(in srgb, var(--progress) 16%, transparent);
    color: var(--text);
}

.line.removed {
    background: color-mix(in srgb, var(--danger) 14%, transparent);
    color: var(--text-3);
    text-decoration: line-through;
}

.edit {
    display: flex;
    flex-direction: column;
    gap: 8px;
    margin: 10px 0;
}

.edit input,
.edit textarea {
    padding: 8px 10px;
    border: 1px solid var(--border-2);
    border-radius: 8px;
    background: var(--sunk, transparent);
    color: var(--text);
    font: inherit;
}

.edit-title {
    font-size: 18px;
    font-weight: 600;
}

.edit-part {
    font-weight: 600;
}

.edit-row {
    display: flex;
    gap: 8px;
}

.skeleton {
    display: flex;
    flex-direction: column;
    gap: 10px;
    margin-top: 16px;
}

.blank {
    display: block;
    height: 12px;
    border-radius: 4px;
    background: var(--border);
}

.blank.wide {
    height: 20px;
    width: 60%;
}

.blank.half {
    width: 40%;
}
</style>
