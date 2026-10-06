<script setup>
import {meta} from "../domain/spec.js";
import Folded from "../kit/Folded.vue";
import {computed, inject, nextTick, reactive, ref} from "vue";
import {api} from "../api/client.js";
import {byRef, parkedFor, waitsOn} from "../domain/records.js";
import {unanswered} from "../domain/buttons.js";
import Notice from "../kit/Notice.vue";
import Sections from "./Sections.vue";
import {useWriting} from "../composables/writing.js";
import OptionsPicker from "./OptionsPicker.vue";
import StageMeanings from "./StageMeanings.vue";
import DataFields from "./DataFields.vue";
import Trace from "./Trace.vue";
import Comments from "./Comments.vue";
import Links from "./Links.vue";
import Asked from "./Asked.vue";
import SequenceRuns from "./SequenceRuns.vue";
import SequenceSteps from "./SequenceSteps.vue";
import CheckResult from "./CheckResult.vue";
import ChoiceCard from "./ChoiceCard.vue";
import TriggerEditor from "./TriggerEditor.vue";
import RuleControls from "./RuleControls.vue";
import TextDisplay from "../kit/TextDisplay.vue";
import {standing} from "../domain/documents.js";
import ResourceBlock from "./ResourceBlock.vue";
import ResourceControls from "./ResourceControls.vue";
import ResourceDocs from "./ResourceDocs.vue";
import ResourceEdit from "./ResourceEdit.vue";
import ResourceFiles from "./ResourceFiles.vue";
import ResourceHead from "./ResourceHead.vue";
import ResourceKeywords from "./ResourceKeywords.vue";
import ResourceMadeFor from "./ResourceMadeFor.vue";
import ResourceOutcome from "./ResourceOutcome.vue";
import ResourceWaits from "./ResourceWaits.vue";

const props = defineProps({
    resource: Object,
    comments: {type: Boolean, default: true},
    commentComposer: {type: Boolean, default: true},
    links: {type: Boolean, default: true},
    readOnly: Boolean,
});
const talk = inject("talk", null);
const talking = computed(() => Boolean(talk?.running.value));
const data = computed(() => props.resource.data || {});
const emit = defineEmits(["close"]);
const kind = computed(() => meta(props.resource.type));
const files = computed(() => Object.entries(props.resource.data.files || {}));
const blocked = computed(() => props.resource.data.blocked || "");
const seenBy = computed(() => props.resource.seen.join(", ") || "nobody");
const briefLabel = computed(() => kind.value.labels.brief || "");
const buttons = computed(() => (Array.isArray(props.resource.data.buttons) ? props.resource.data.buttons : []));
const hasFields = computed(() => kind.value.shown_fields.length > 0 && props.resource.type !== "trigger");
const optioned = computed(() => !!kind.value.fields.options);
const ranked = computed(() => !!kind.value.fields.priority && !props.resource.completed);
const traced = computed(() => !!kind.value.fields.changed);
const madeFor = computed(() => (kind.value.fields.applies_to ? props.resource.data.applies_to || [] : null));
const keyworded = computed(() => Boolean(kind.value.fields.keywords));
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
const hasOutcome = computed(() => !!props.resource.completed && !state.value?.said);
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
</script>

<template>
    <article ref="page" class="body">
        <ResourceHead
            v-model:title="draft.title"
            :resource="resource"
            :kind="kind"
            :state="state"
            :writing="writing"
            :read-only="readOnly"
            :editing="editing"
            :body="page"
            @close="emit('close')"
            @follow="follow"
            @cancel="editing = false"
        >
            <template #tools><slot name="tools" /></template>
        </ResourceHead>
        <slot name="head" />
        <template v-if="editing">
            <ResourceEdit
                v-model:abstract="draft.abstract"
                v-model:brief="draft.brief"
                :brief-label="briefLabel"
                :error="draft.error"
                @save="save"
                @cancel="editing = false"
            />
        </template>
        <template v-else-if="resource.abstract">
            <TextDisplay class="abstract" :text="resource.abstract" />
        </template>
        <template v-if="resource.deleted">
            <p class="waits">This was deleted.</p>
        </template>
        <template v-else-if="!editing && !readOnly">
            <ResourceControls
                :resource="resource"
                :standing="Boolean(state)"
                :system="Boolean(data.system)"
                :ranked="ranked"
                @edit="edit"
                @close="emit('close')"
            />
        </template>
        <template v-if="!resource.completed && (blocked || parkedFor(resource) || waits.length)">
            <ResourceWaits :resource="resource" :blocked="blocked" :waits="waits" />
        </template>
        <template v-if="resource.type === 'rule' && !resource.completed">
            <RuleControls :resource="resource" />
        </template>
        <template v-if="unanswered(resource) && !readOnly">
            <Notice>
                This {{ resource.type }} asks you to choose, at the end.
                <button
                    type="button"
                    class="go"
                    @click="page.querySelector('.choice')?.scrollIntoView({behavior: 'smooth', block: 'center'})"
                >
                    Go to the choice
                </button>
            </Notice>
        </template>
        <template v-if="resource.type === 'check'">
            <CheckResult :resource="resource" />
        </template>
        <template v-if="hasFields">
            <DataFields :resource="resource" />
        </template>
        <template v-if="optioned">
            <OptionsPicker :resource="resource" />
        </template>
        <template v-if="resource.type === 'board'">
            <StageMeanings :board="resource" />
        </template>
        <template v-if="madeFor">
            <ResourceMadeFor :types="madeFor" />
        </template>
        <template v-if="resource.type === 'trigger'">
            <TriggerEditor :resource="resource" />
        </template>
        <template v-if="keyworded && !readOnly">
            <ResourceKeywords :resource="resource" />
        </template>
        <template v-if="resource.brief && !editing && resource.type !== 'trigger'">
            <ResourceBlock :heading="briefLabel">
                <TextDisplay :text="resource.brief" />
            </ResourceBlock>
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
        <template v-if="buttons.length && !readOnly">
            <ChoiceCard :resource="resource" />
        </template>
        <template v-if="traced">
            <Trace :resource="resource" />
        </template>
        <template v-if="hasOutcome">
            <ResourceOutcome :resource="resource" :documented="Boolean(state)" />
        </template>
        <template v-if="files.length">
            <ResourceFiles :resource="resource" :files="files" />
        </template>
        <template v-if="!readOnly">
            <Asked :resource="resource" />
            <template v-if="!talking">
                <SequenceRuns :resource="resource" />
            </template>
        </template>
        <slot />
        <template v-if="docs.length">
            <ResourceDocs :docs="docs" />
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

.go {
    padding: 0;
    border: 0;
    background: none;
    color: var(--accent-text);
    font: inherit;
    cursor: pointer;
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
