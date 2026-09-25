<script setup>
import Folded from "../kit/Folded.vue";
import SectionHeading from "../kit/SectionHeading.vue";
import SwitchCase from "../kit/SwitchCase.vue";
import CloseButton from "../kit/CloseButton.vue";
import {computed, inject, nextTick, reactive, ref} from "vue";
import {api} from "../api/client.js";
import Btn from "../kit/Btn.vue";
import CommentToggle from "./CommentToggle.vue";
import DownloadLink from "./DownloadLink.vue";
import Icon from "../kit/Icon.vue";
import {peek, route} from "../route.js";
import {byRef, parkedFor, waitsOn} from "../domain/records.js";
import {age} from "../format/time.js";
import {label, meta, word} from "../state/store.js";
import ResourceActions from "./ResourceActions.vue";
import Sections from "./Sections.vue";
import Chapters from "./Chapters.vue";
import {useWriting} from "../composables/writing.js";
import {isUpdate, updateLabel} from "../domain/updates.js";
import OptionsPicker from "./OptionsPicker.vue";
import StageMeanings from "./StageMeanings.vue";
import Priority from "./Priority.vue";
import DataFields from "./DataFields.vue";
import Trace from "./Trace.vue";
import Comments from "./Comments.vue";
import Links from "./Links.vue";
import Asked from "./Asked.vue";
import SequenceRuns from "./SequenceRuns.vue";
import SequenceSteps from "./SequenceSteps.vue";
import ShareButton from "./ShareButton.vue";
import CheckResult from "./CheckResult.vue";
import Buttons from "./Buttons.vue";
import RuleControls from "./RuleControls.vue";
import TextDisplay from "../kit/TextDisplay.vue";
import ResourceCard from "./ResourceCard.vue";
import AttachFiles from "./AttachFiles.vue";
import {standing} from "../domain/documents.js";

const props = defineProps({
    resource: Object,
    comments: {type: Boolean, default: true},
    commentComposer: {type: Boolean, default: true},
    links: {type: Boolean, default: true},
    readOnly: Boolean,
});
const fileUrl = inject("fileUrl", (type, n, name) => api.fileUrl(type, n, name));
const talk = inject("talk", null);
const emit = defineEmits(["close"]);
const kind = computed(() => meta(props.resource.type));
const files = computed(() => Object.entries(props.resource.data.files || {}));
const template = computed(() => props.resource.data.template || "");
const blocked = computed(() => props.resource.data.blocked || "");
const seenBy = computed(() => props.resource.seen.join(", ") || "nobody");
const briefLabel = computed(() => kind.value.labels.brief || "");
const buttons = computed(() => (Array.isArray(props.resource.data.buttons) ? props.resource.data.buttons : []));
const fieldsShown = computed(() => kind.value.shown_fields.length > 0);
const optioned = computed(() => !!kind.value.fields.options);
const ranked = computed(() => !!kind.value.fields.priority && !props.resource.completed);
const traced = computed(() => !!kind.value.fields.changed);
const madeFor = computed(() => (kind.value.fields.applies_to ? props.resource.data.applies_to || [] : null));
const keywords = computed(() =>
    kind.value.fields.keywords && Array.isArray(props.resource.data.keywords) ? props.resource.data.keywords : []
);
const SCOPES = [
    ["text", "Text", "What the agent writes: edits and chat"],
    ["commands", "Commands", "Shell commands"],
    ["both", "Both", "Shell commands, edits and chat"],
    ["everything", "Everything", "Any tool call, file paths, searches and URLs included"],
];
const scope = computed(() => props.resource.data.keywords_in || "both");
const matchIn = (value) => api.act(props.resource.type, props.resource.n, "set", {key: "keywords_in", value});
const waits = computed(() => (props.resource.completed ? [] : waitsOn(props.resource)));
const editing = ref(false);
const draft = reactive({title: "", abstract: "", brief: "", error: ""});

function edit() {
    Object.assign(draft, {title: props.resource.title, abstract: props.resource.abstract, brief: props.resource.brief, error: ""});
    editing.value = true;
}

async function save() {
    draft.error = "";
    try {
        await api.act(props.resource.type, props.resource.n, "update", {
            title: draft.title.trim(),
            abstract: draft.abstract.trim(),
            brief: draft.brief,
        });
        editing.value = false;
    } catch (e) {
        draft.error = e.message;
    }
}
const state = computed(() => (props.resource.type === "doc" ? standing(props.resource) : null));
const outcomeShown = computed(() => !!props.resource.completed && !state.value?.said);
const WITHOUT_DOC_CARDS = ["doc", "collection"];
const docs = computed(() =>
    WITHOUT_DOC_CARDS.includes(props.resource.type)
        ? []
        : props.resource.refs
              .filter((ref) => ref.startsWith("doc:"))
              .map(byRef)
              .filter((d) => d && !d.deleted)
);
const PAGE = Math.round(window.innerHeight * 0.9);
const page = ref(null);
const writing = useWriting(() => props.resource.ref);

async function follow() {
    const parts = [...(page.value?.querySelectorAll(".section.reading") || [])];
    const part = parts.find((el) => el.querySelector("h3")?.textContent.trim() === writing.value?.section) || parts.at(-1);
    if (!part) return;
    part.closest(".folded-body")?.dispatchEvent(new Event("reveal"));
    await nextTick();
    part.scrollIntoView({block: "center", behavior: "smooth"});
}
const chaptered = computed(
    () => kind.value.view === "document" && !["message", "sequence"].includes(props.resource.type) && props.resource.sections.length >= 2
);
</script>

<template>
    <article ref="page" class="body">
        <header class="head">
            <div class="top">
                <span class="kind">
                    <Icon :name="kind.icon" :size="13" />
                    {{ isUpdate(resource) ? updateLabel(resource) : `${kind.title} ${resource.n}` }}
                </span>
                <template v-if="state && !readOnly">
                    <SwitchCase :value="state.key">
                        <template #replaced>
                            <button type="button" class="standing replaced" :title="state.hint" @click="peek('doc', state.by)">
                                {{ state.label }}
                                <Icon name="arrow" :size="10" />
                            </button>
                        </template>
                        <template #default>
                            <span :class="['standing', state.key]" :title="state.hint">
                                <template v-if="state.key === 'final'">
                                    <Icon name="check" :size="10" />
                                </template>
                                {{ state.label }}
                            </span>
                        </template>
                    </SwitchCase>
                </template>
                <template v-if="resource.data.system">
                    <span class="standing system" title="Ships with the journal; it can be read but not changed">
                        <Icon name="lock" :size="10" />
                        System
                    </span>
                </template>
                <template v-if="writing && kind.view === 'document' && !readOnly">
                    <button type="button" class="writing-now" title="Go to what the agent is writing" @click="follow">
                        <span class="writing-dot" />
                        Agent writing
                        <template v-if="writing.section">
                            <span class="writing-where">{{ writing.section }}</span>
                        </template>
                    </button>
                </template>
                <span class="age">{{ age(resource.created) }}</span>
                <slot name="tools" />
                <template v-if="!readOnly">
                    <template v-if="kind.view === 'document'">
                        <DownloadLink :resource="resource" />
                    </template>
                    <CloseButton @click="emit('close')" />
                </template>
            </div>
            <template v-if="resource.data?.template && !readOnly">
                <button type="button" class="from" @click="peek('template', Number(template))">
                    <Icon name="docs" :size="11" />
                    Made from template {{ template }}
                </button>
            </template>
            <template v-if="editing">
                <input
                    v-model="draft.title"
                    class="edit-title"
                    maxlength="80"
                    placeholder="Title, at most 80 characters"
                    @keydown.esc="editing = false"
                />
            </template>
            <template v-else>
                <h2 class="title">{{ resource.title }}</h2>
                <template v-if="chaptered">
                    <Chapters :sections="resource.sections" :body="page" />
                </template>
            </template>
        </header>
        <slot name="head" />
        <template v-if="editing">
            <form class="edit" @submit.prevent="save">
                <textarea
                    v-model="draft.abstract"
                    rows="2"
                    maxlength="200"
                    placeholder="Abstract, at most 200 characters"
                    @keydown.esc="editing = false"
                />
                <textarea v-model="draft.brief" rows="6" :placeholder="briefLabel || 'Brief'" @keydown.esc="editing = false" />
                <div class="edit-row">
                    <Btn kind="primary" small @click="save">Save</Btn>
                    <Btn small @click="editing = false">Cancel</Btn>
                    <template v-if="draft.error">
                        <span class="edit-error">{{ draft.error }}</span>
                    </template>
                </div>
            </form>
        </template>
        <template v-else-if="resource.abstract">
            <TextDisplay class="abstract" :text="resource.abstract" />
        </template>
        <template v-if="resource.deleted">
            <p class="waits">This was deleted.</p>
        </template>
        <template v-else-if="!editing && !readOnly">
            <div class="controls">
                <ResourceActions :resource="resource" @edit="edit" @close="emit('close')" />
                <span class="controls-end">
                    <template v-if="state && !resource.data.system">
                        <AttachFiles :resource="resource" />
                    </template>
                    <template v-if="['doc', 'collection', 'report'].includes(resource.type) && !resource.data.system">
                        <ShareButton :resource="resource" />
                    </template>
                    <CommentToggle :resource="resource" />
                </span>
                <template v-if="ranked">
                    <Priority :resource="resource" />
                </template>
            </div>
        </template>
        <template v-if="!resource.completed && (blocked || parkedFor(resource) || waits.length)">
            <p class="waits">
                <template v-if="blocked">Blocked: {{ blocked }}</template>
                <template v-if="parkedFor(resource)">Parked: {{ parkedFor(resource) }}</template>
                <template v-if="waits.length">
                    Waits on
                    <template v-for="(ref, i) in waits" :key="ref">
                        <button type="button" class="wait" @click="peek(ref.split(':')[0], Number(ref.split(':')[1]))">
                            {{ ref.replace("todo:", "to-do ").replace("plan:", "plan ") }}
                        </button>
                        {{ i < waits.length - 1 ? ", " : "" }}
                    </template>
                </template>
            </p>
        </template>
        <template v-if="resource.type === 'rule' && !resource.completed">
            <RuleControls :resource="resource" />
        </template>
        <template v-if="resource.type === 'check'">
            <CheckResult :resource="resource" />
        </template>
        <template v-if="buttons.length && !readOnly">
            <Buttons :resource="resource" />
        </template>
        <template v-if="fieldsShown">
            <DataFields :resource="resource" />
        </template>
        <template v-if="optioned">
            <OptionsPicker :resource="resource" />
        </template>
        <template v-if="resource.type === 'board'">
            <StageMeanings :board="resource" />
        </template>
        <template v-if="madeFor">
            <section class="block">
                <SectionHeading>Made for</SectionHeading>
                <div class="keywords">
                    <template v-if="madeFor.length">
                        <template v-for="type in madeFor" :key="type">
                            <span class="keyword">{{ meta(type) ? meta(type).title : type }}</span>
                        </template>
                    </template>
                    <template v-else>
                        <span class="keyword">any kind of row</span>
                    </template>
                </div>
            </section>
        </template>
        <template v-if="keywords.length">
            <section class="block">
                <SectionHeading>Keywords</SectionHeading>
                <p class="lead">Said to the agent when one of these words comes up in what it is about to run or write.</p>
                <div class="keywords">
                    <template v-for="word in keywords" :key="word">
                        <span class="keyword">{{ word }}</span>
                    </template>
                </div>
                <div class="scopes">
                    <span class="scopes-label">Matched in</span>
                    <template v-for="[value, name, hint] in SCOPES" :key="value">
                        <button type="button" :class="['scope', {on: scope === value}]" :title="hint" @click="matchIn(value)">
                            {{ name }}
                        </button>
                    </template>
                </div>
            </section>
        </template>
        <template v-if="resource.brief && !editing">
            <section class="block">
                <template v-if="briefLabel">
                    <SectionHeading>{{ briefLabel }}</SectionHeading>
                </template>
                <TextDisplay :text="resource.brief" />
            </section>
        </template>
        <template v-if="resource.type === 'sequence'">
            <SequenceSteps :resource="resource" />
        </template>
        <template v-else-if="resource.type !== 'message' && kind.view === 'document'">
            <Folded :key="resource.n" :at="PAGE" :keep="PAGE">
                <Sections :sections="resource.sections" :writing="writing?.section || ''" document />
            </Folded>
        </template>
        <template v-else-if="resource.type !== 'message'">
            <Sections :sections="resource.sections" />
        </template>
        <template v-if="traced">
            <Trace :resource="resource" />
        </template>
        <template v-if="outcomeShown">
            <section class="block">
                <SectionHeading>
                    {{
                        state
                            ? "Note when marked final"
                            : label(
                                  resource.type,
                                  "outcome",
                                  word(resource.type, "complete").replace(/^\w/, (c) => c.toUpperCase())
                              )
                    }}
                </SectionHeading>
                <TextDisplay :text="resource.outcome || age(resource.completed)" />
            </section>
        </template>
        <template v-if="files.length">
            <section class="block">
                <SectionHeading>Files</SectionHeading>
                <template v-for="[name, description] in files" :key="name">
                    <a class="file" :href="fileUrl(resource.type, resource.n, name)" target="_blank" :title="name">
                        <Icon name="clip" :size="13" />
                        <span class="file-text">
                            <span class="file-name">{{ name }}</span>
                            <template v-if="description">
                                <span class="description">{{ description }}</span>
                            </template>
                        </span>
                    </a>
                </template>
            </section>
        </template>
        <template v-if="!readOnly">
            <Asked :resource="resource" />
            <template v-if="!talk?.running.value">
                <SequenceRuns :resource="resource" />
            </template>
        </template>
        <slot />
        <template v-if="docs.length">
            <section class="linked-docs">
                <SectionHeading class="linked-docs-head">Documents</SectionHeading>
                <div class="linked-docs-cards">
                    <template v-for="d in docs" :key="d.ref">
                        <ResourceCard :resource="d" @click="peek('doc', d.n)" />
                    </template>
                </div>
            </section>
        </template>
        <template v-if="links && !readOnly">
            <Links :resource="resource" :except="docs.map((d) => d.ref)" />
        </template>
        <template v-if="!readOnly">
            <footer class="foot">seen by {{ seenBy }}</footer>
        </template>
        <template v-if="comments && kind?.takes_comments && !readOnly">
            <Comments :resource="resource" :compose="commentComposer" />
        </template>
    </article>
</template>

<style scoped>
.from {
    display: inline-flex;
    align-items: center;
    align-self: flex-start;
    gap: 5px;
    margin-top: 6px;
    padding: 0;
    border: 0;
    background: none;
    color: var(--text-3);
    font-size: 12px;
    cursor: pointer;
}

.from:hover {
    color: var(--text);
}

.body {
    display: flex;
    flex-direction: column;
    min-width: 0;
    min-height: 100%;
    padding: 16px 16px 0;
    overflow-wrap: anywhere;
}
.head {
    position: sticky;
    top: 0;
    z-index: 2;
    margin: -16px -16px 0;
    padding: 16px 16px 8px;
    background: var(--bg);
    border-bottom: 1px solid var(--border);
}

.top {
    display: flex;
    align-items: center;
    gap: 10px;
    color: var(--text-3);
    font-size: 11.5px;
    text-transform: uppercase;
    letter-spacing: 0.04em;
}
.kind {
    display: inline-flex;
    align-items: center;
    gap: 6px;
    white-space: nowrap;
    color: var(--accent-text);
}
.age {
    flex: 1 0 auto;
    white-space: nowrap;
}

.writing-now {
    display: inline-flex;
    align-items: center;
    gap: 6px;
    min-width: 0;
    max-width: 280px;
    padding: 0 8px 0 7px;
    border: 1px solid color-mix(in srgb, var(--accent) 45%, transparent);
    border-radius: 99px;
    background: color-mix(in srgb, var(--accent) 12%, transparent);
    color: var(--accent-text);
    font: inherit;
    font-size: 10.5px;
    line-height: 17px;
    letter-spacing: 0;
    text-transform: none;
    white-space: nowrap;
    cursor: pointer;
}

.writing-now:hover {
    background: color-mix(in srgb, var(--accent) 22%, transparent);
}

.writing-dot {
    flex: none;
    width: 6px;
    height: 6px;
    border-radius: 50%;
    background: var(--accent-text);
    animation: writing-pulse 1.4s ease-in-out infinite;
}

.writing-where {
    min-width: 0;
    overflow: hidden;
    text-overflow: ellipsis;
    color: var(--text-2);
}

.writing-where::before {
    content: "· ";
}

@keyframes writing-pulse {
    50% {
        opacity: 0.35;
        transform: scale(0.7);
    }
}

.standing {
    flex: none;
    white-space: nowrap;
    display: inline-flex;
    align-items: center;
    gap: 4px;
    padding: 0 7px;
    border: 1px solid var(--border-2);
    border-radius: 99px;
    color: var(--text-2);
    font: inherit;
    font-size: 10.5px;
    line-height: 17px;
    letter-spacing: 0;
    text-transform: none;
    background: none;
}

.standing.draft {
    border-style: dashed;
    color: var(--text-3);
}

.standing.replaced {
    cursor: pointer;
}

.standing.replaced:hover {
    border-color: var(--accent);
    color: var(--accent-text);
}
.title {
    margin: 10px 0 0;
    font-size: 19px;
    font-weight: 600;
    line-height: 1.3;
}
.abstract {
    margin: 12px 0 8px;
    color: var(--text-2);
}
.edit-title {
    width: 100%;
    margin: 10px 0 0;
    padding: 6px 10px;
    border: 1px solid var(--border-2);
    border-radius: 7px;
    background: var(--raised);
    font-size: 17px;
    font-weight: 600;
}
.edit {
    display: flex;
    flex-direction: column;
    gap: 8px;
    margin: 12px 0;
}
.edit textarea {
    width: 100%;
    padding: 8px 10px;
    border: 1px solid var(--border-2);
    border-radius: 7px;
    background: var(--raised);
    font: inherit;
    resize: vertical;
}
.edit-row {
    display: flex;
    align-items: center;
    gap: 6px;
}
.edit-error {
    color: var(--danger);
    font-size: 12px;
}
.block {
    margin-top: 16px;
}

.lead {
    margin: 0 0 8px;
    color: var(--text-4);
    font-size: 12px;
}

.keywords {
    display: flex;
    flex-wrap: wrap;
    gap: 6px;
}

.scopes {
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    gap: 4px;
    margin-top: 8px;
}
.scopes-label {
    margin-right: 4px;
    color: var(--text-3);
    font-size: 12px;
}
.scope {
    padding: 2px 8px;
    border: 1px solid transparent;
    border-radius: 99px;
    background: none;
    color: var(--text-3);
    font-size: 12px;
    cursor: pointer;
}
.scope:hover {
    color: var(--text-2);
}
.scope.on {
    border-color: var(--border-2);
    background: var(--raised);
    color: var(--text);
}
.keyword {
    padding: 2px 8px;
    border: 1px solid var(--border-2);
    border-radius: 99px;
    background: var(--raised);
    color: var(--text-2);
    font-size: 12px;
}
.block h3 {
    margin: 0 0 4px;
}
.file {
    display: flex;
    align-items: flex-start;
    gap: 6px;
    padding: 3px 0;
    color: var(--accent-text);
}
.file .ico {
    flex-shrink: 0;
    margin-top: 2px;
}
.file-text {
    display: flex;
    flex-direction: column;
    min-width: 0;
}
.file-name {
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
}
.description {
    color: var(--text-3);
    font-size: 12px;
}
.foot {
    margin-top: 18px;
    color: var(--text-3);
    font-size: 11.5px;
}
.waits {
    margin: 10px 0 0;
    color: var(--blocking);
    font-size: 12.5px;
}

.wait {
    padding: 0;
    border: 0;
    background: none;
    color: var(--accent-text);
    font: inherit;
    cursor: pointer;
}

.controls {
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    justify-content: space-between;
    gap: 10px;
}

.controls-end {
    order: 2;
    display: inline-flex;
    align-items: center;
    gap: 6px;
    margin-left: auto;
}

.linked-docs {
    margin: 18px 0 0;
}

.linked-docs-head {
    margin: 0 0 8px;
    color: var(--text-3);
    font-size: 11px;
    font-weight: 500;
    letter-spacing: 0.04em;
    text-transform: uppercase;
}

.linked-docs-cards {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(220px, 1fr));
    gap: 10px;
}
</style>
