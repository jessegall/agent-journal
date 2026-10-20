<script setup>
import {meta} from "../domain/tables.js";
import Folded from "../kit/Folded.vue";
import {computed, inject, nextTick, reactive, ref} from "vue";
import {api} from "../api/client.js";
import {editsOf} from "../domain/acts.js";
import {bodyOf, isClosed, refOf, sectionsOf} from "../domain/row.js";
import Sections from "./Sections.vue";
import {useWriting} from "../composables/writing.js";
import OptionsPicker from "./OptionsPicker.vue";
import Comments from "./Comments.vue";
import Links from "./Links.vue";
import SequenceRuns from "./SequenceRuns.vue";
import SequenceSteps from "./SequenceSteps.vue";
import CheckResult from "./CheckResult.vue";
import ChoiceCard from "./ChoiceCard.vue";
import TriggerEditor from "./TriggerEditor.vue";
import TextDisplay from "../kit/TextDisplay.vue";
import ResourceBlock from "./ResourceBlock.vue";
import ResourceControls from "./ResourceControls.vue";
import ResourceEdit from "./ResourceEdit.vue";
import ResourceFiles from "./ResourceFiles.vue";
import ResourceHead from "./ResourceHead.vue";
import ResourceKeywords from "./ResourceKeywords.vue";
import ResourceMadeFor from "./ResourceMadeFor.vue";
import ResourceOutcome from "./ResourceOutcome.vue";
import ResourceWaits from "./ResourceWaits.vue";
import TaskLogs from "./TaskLogs.vue";

const props = defineProps({
    resource: Object,
    comments: {type: Boolean, default: true},
    commentComposer: {type: Boolean, default: true},
    links: {type: Boolean, default: true},
    attached: {type: Boolean, default: true},
    readOnly: Boolean,
    focus: {type: Number, default: 0},
});
const talk = inject("talk", null);
const talking = computed(() => Boolean(talk?.running.value));
const emit = defineEmits(["close"]);
const table = computed(() => props.resource.table);
const kind = computed(() => meta(table.value));
const body = computed(() => bodyOf(props.resource));
const sections = computed(() => sectionsOf(props.resource.body));
const SHOWN_APART = ["triggers", "sequences", "messages", "questions"];
const edits = computed(() => editsOf(props.resource));
const editing = ref(false);
const draft = reactive({fields: {}, error: ""});

function edit() {
    draft.fields = Object.fromEntries(Object.keys(edits.value).map((field) => [field, props.resource[field] || ""]));
    draft.error = "";
    editing.value = true;
}

async function save() {
    draft.error = "";
    try {
        await api.change(table.value, props.resource.id, draft.fields);
        editing.value = false;
    } catch (e) {
        draft.error = e.message;
    }
}

const PAGE = Math.round(window.innerHeight * 0.9);
const page = ref(null);
const writing = useWriting(() => refOf(props.resource));

async function follow() {
    const parts = [...(page.value?.querySelectorAll(".section.reading") || [])];
    const part = parts.find((el) => el.querySelector("h3")?.textContent.trim() === writing.value?.section) || parts.at(-1);
    if (!part) return;
    part.closest(".folded-body")?.dispatchEvent(new Event("reveal"));
    await nextTick();
    part.scrollIntoView({block: "center", behavior: "smooth"});
}
</script>

<template>
    <article ref="page" class="body">
        <ResourceHead :resource="resource" :kind="kind" :writing="writing" :read-only="readOnly" :editing="editing" :body="page" @close="emit('close')" @follow="follow">
            <template #tools><slot name="tools" /></template>
        </ResourceHead>
        <slot name="head" />
        <template v-if="editing">
            <ResourceEdit v-model:draft="draft.fields" :table="table" :fields="edits" :error="draft.error" @save="save" @cancel="editing = false" />
        </template>
        <template v-else-if="resource.abstract">
            <TextDisplay class="abstract" :text="resource.abstract" />
        </template>
        <template v-if="!editing && !readOnly">
            <ResourceControls :resource="resource" @edit="edit" @close="emit('close')" />
        </template>
        <template v-if="!isClosed(resource) && (resource.blocked_why || resource.parked_why)">
            <ResourceWaits :resource="resource" />
        </template>
        <template v-if="table === 'checks'">
            <CheckResult :resource="resource" />
        </template>
        <template v-if="table === 'questions'">
            <TextDisplay :text="resource.text" />
            <OptionsPicker :question="resource" />
        </template>
        <template v-if="table === 'templates'">
            <ResourceMadeFor :types="resource.applies_to" />
        </template>
        <template v-if="table === 'triggers'">
            <TriggerEditor :resource="resource" />
        </template>
        <template v-if="resource.keywords && !readOnly">
            <ResourceKeywords :resource="resource" />
        </template>
        <template v-if="table === 'sequences'">
            <SequenceSteps :resource="resource" />
        </template>
        <template v-else-if="table === 'messages'">
            <TextDisplay :text="resource.text" />
            <template v-if="!readOnly">
                <ChoiceCard :message="resource" />
            </template>
        </template>
        <template v-else-if="sections.length && kind.view === 'document'">
            <Folded :key="resource.id" :name="`${table}:${resource.id}`" :at="PAGE" :keep="PAGE">
                <Sections :sections="sections" :writing="writing?.section || ''" document />
            </Folded>
        </template>
        <template v-else-if="body && !editing && !SHOWN_APART.includes(table)">
            <ResourceBlock :heading="kind.labels.brief || ''">
                <TextDisplay :text="body" />
            </ResourceBlock>
        </template>
        <template v-if="table === 'tasks'">
            <TaskLogs :task="resource" />
        </template>
        <template v-if="resource.outcome && isClosed(resource)">
            <ResourceOutcome :resource="resource" />
        </template>
        <template v-if="attached && (resource.files || []).length">
            <ResourceFiles :resource="resource" />
        </template>
        <template v-if="!readOnly && !talking">
            <SequenceRuns :resource="resource" />
        </template>
        <slot />
        <template v-if="links && !readOnly">
            <Links :resource="resource" />
        </template>
        <template v-if="comments && kind?.takes_comments && !readOnly">
            <Comments :resource="resource" :compose="commentComposer" :focus="focus" />
        </template>
    </article>
</template>

<style scoped>
.body {
    display: flex;
    flex-direction: column;
    min-width: 0;
    min-height: 100%;
    padding: 16px 16px 0;
    overflow-wrap: anywhere;
}

.abstract {
    margin: 12px 0 8px;
    color: var(--text-2);
}

.choose {
    margin-top: 10px;
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
</style>
