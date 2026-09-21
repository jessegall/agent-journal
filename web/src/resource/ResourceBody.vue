<script setup>
import {computed, reactive, ref} from "vue";
import {api} from "../api/client.js";
import Btn from "../kit/Btn.vue";
import CommentToggle from "./CommentToggle.vue";
import Icon from "../kit/Icon.vue";
import {peek, route} from "../route.js";
import {waitsOn} from "../domain/records.js";
import {age} from "../format/time.js";
import {label, meta, word} from "../state/store.js";
import ResourceActions from "./ResourceActions.vue";
import Sections from "./Sections.vue";
import OptionsPicker from "./OptionsPicker.vue";
import Priority from "./Priority.vue";
import Trace from "./Trace.vue";
import Comments from "./Comments.vue";
import Links from "./Links.vue";
import Asked from "./Asked.vue";
import CheckResult from "./CheckResult.vue";
import Buttons from "./Buttons.vue";
import RuleControls from "./RuleControls.vue";
import Markdown from "./Markdown.vue";

const props = defineProps({
    resource: Object,
    comments: {type: Boolean, default: true},
    commentComposer: {type: Boolean, default: true},
});
const emit = defineEmits(["close"]);
const kind = computed(() => meta(props.resource.type));
const files = computed(() => Object.entries(props.resource.data.files || {}));
const ranked = computed(() => !!kind.value.fields.priority && !props.resource.completed);
const traced = computed(() => !!kind.value.fields.changed);
const keywords = computed(() =>
    kind.value.fields.keywords && Array.isArray(props.resource.data.keywords) ? props.resource.data.keywords : []
);
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
</script>

<template>
    <article class="body">
        <header class="head">
            <div class="top">
                <span class="kind">
                    <Icon :name="kind.icon" :size="13" />
                    {{ kind.title }} {{ resource.n }}
                </span>
                <span class="age">{{ age(resource.created) }}</span>
                <CommentToggle />
                <Btn kind="icon" @click="emit('close')"><Icon name="x" /></Btn>
            </div>
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
            </template>
        </header>
        <template v-if="editing">
            <form class="edit" @submit.prevent="save">
                <textarea
                    v-model="draft.abstract"
                    rows="2"
                    maxlength="200"
                    placeholder="Abstract, at most 200 characters"
                    @keydown.esc="editing = false"
                />
                <textarea v-model="draft.brief" rows="6" :placeholder="kind.labels.brief || 'Brief'" @keydown.esc="editing = false" />
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
            <Markdown class="abstract" :text="resource.abstract" />
        </template>
        <template v-if="resource.deleted">
            <p class="waits">This was deleted.</p>
        </template>
        <template v-else-if="!editing">
            <div class="controls">
                <ResourceActions :resource="resource" @edit="edit" />
                <template v-if="ranked">
                    <Priority :resource="resource" />
                </template>
            </div>
        </template>
        <template v-if="!resource.completed && (resource.data.blocked || waits.length)">
            <p class="waits">
                <template v-if="resource.data.blocked">Blocked: {{ resource.data.blocked }}</template>
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
        <template v-if="Array.isArray(resource.data.buttons) && resource.data.buttons.length">
            <Buttons :resource="resource" />
        </template>
        <template v-if="kind.fields.options">
            <OptionsPicker :resource="resource" />
        </template>
        <template v-if="keywords.length">
            <section class="block">
                <h3>Keywords</h3>
                <p class="lead">Said to the agent when one of these comes up in what it is about to run or write.</p>
                <div class="keywords">
                    <template v-for="word in keywords" :key="word">
                        <span class="keyword">{{ word }}</span>
                    </template>
                </div>
            </section>
        </template>
        <template v-if="resource.brief && !editing">
            <section class="block">
                <template v-if="kind.labels.brief">
                    <h3>{{ kind.labels.brief }}</h3>
                </template>
                <Markdown :text="resource.brief" />
            </section>
        </template>
        <template v-if="resource.type !== 'message'">
            <Sections :sections="resource.sections" />
        </template>
        <template v-if="traced">
            <Trace :resource="resource" />
        </template>
        <template v-if="resource.completed">
            <section class="block">
                <h3>
                    {{
                        label(
                            resource.type,
                            "outcome",
                            word(resource.type, "complete").replace(/^\w/, (c) => c.toUpperCase())
                        )
                    }}
                </h3>
                <Markdown :text="resource.outcome || age(resource.completed)" />
            </section>
        </template>
        <template v-if="files.length">
            <section class="block">
                <h3>Files</h3>
                <template v-for="[name, what] in files" :key="name">
                    <a class="file" :href="api.fileUrl(resource.type, resource.n, name)" target="_blank">
                        <Icon name="clip" :size="13" />
                        {{ name }}
                        <template v-if="what">
                            <span class="what">— {{ what }}</span>
                        </template>
                    </a>
                </template>
            </section>
        </template>
        <Asked :resource="resource" />
        <Links :resource="resource" />
        <footer class="foot">seen by {{ resource.seen.join(", ") || "nobody" }}</footer>
        <template v-if="comments">
            <Comments :resource="resource" :compose="commentComposer" />
        </template>
    </article>
</template>

<style scoped>
.body {
    display: flex;
    flex-direction: column;
    min-height: 100%;
    padding: 16px 20px 0;
}

.body > :deep(.comments) {
    flex: 1;
}
.head {
    position: sticky;
    top: 0;
    z-index: 2;
    margin: -16px -20px 0;
    padding: 16px 20px 8px;
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
    color: var(--accent-text);
}
.age {
    flex: 1;
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
    font-size: 12px;
    font-weight: 600;
    color: var(--text-3);
    text-transform: uppercase;
    letter-spacing: 0.04em;
}
.file {
    display: flex;
    align-items: center;
    gap: 6px;
    color: var(--accent-text);
}
.what {
    color: var(--text-3);
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
    align-items: center;
    justify-content: space-between;
    gap: 10px;
}
</style>
