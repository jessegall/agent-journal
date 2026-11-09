<script setup>
import {computed, onMounted, onUnmounted, provide, ref, watch} from "vue";
import {INSPECTOR_ACTIONS} from "../../kit/windowContextKey.js";
import ButtonSlot from "../kit/ButtonSlot.vue";
import InspectorActions from "../kit/InspectorActions.vue";
import InspectorLinks from "../kit/InspectorLinks.vue";
import QuickCommentBar from "../kit/QuickCommentBar.vue";
import Segmented from "../kit/Segmented.vue";
import Skeleton from "../kit/Skeleton.vue";
import SwitchCase from "../kit/SwitchCase.vue";
import {useTextComments} from "../composables/textComments.js";
import {INSPECTOR_WIDTHS} from "../domain/inspectorWidths.js";
import {fill, inspectorLabel} from "../domain/inspectorText.js";
import {fieldsOf, titleOf} from "../domain/resourceNouns.js";
import {render} from "../text/index.js";
import InspectorSections from "../windows/InspectorSections.vue";
import CommentSide from "./CommentSide.vue";
import InspectorHead from "./InspectorHead.vue";
import ResourceFields from "./ResourceFields.vue";
import {peopleOf} from "./rowPeople.js";
import {useResourceEvents} from "./resourceEvents.js";

// the one layout of an inspector, with no veil and no width of its own so the overlay and the tasks dialog both mount it: the head, the actions of the
// row's model, the text and fields of the row, the parts the declaration names, the comments and the links, all read from the declared listing
const props = defineProps({
    term: {type: String, required: true},
    id: {type: Number, required: true},
    read: {type: Function, required: true},
    catalogue: {type: Object, required: true},
    environment: {type: String, required: true},
    table: {type: String, default: ""},
    readOnly: Boolean,
    backed: Boolean,
    stepped: Boolean,
    embedded: Boolean,
});
const emit = defineEmits(["close", "back", "step", "open"]);
const actionBar = ref(null);
provide(INSPECTOR_ACTIONS, computed(() => actionBar.value?.$el ?? null));

const TEXT_NOUNS = new Set(["question", "memory", "rule"]);
const listing = computed(() => props.catalogue.inspector(props.term) ?? {
    reads: `${props.term} show {row_id}`, label: "", title: "{title}", description: "", width: "small", components: [], comments: false, events: [],
    links: {categories: [], open: false, excludes_plan: false, page_size: 10}, shareable: false, lists_fields: true, draws_text: false,
});
const row = ref(null);
const creator = ref("");
const owner = ref("");
const failure = ref("");
const tab = ref("details");
const root = ref(null);
const drawnWidth = ref(0);
let reading = 0;

const filled = computed(() => ({row_id: props.id, id: props.id}));
const title = computed(() => (row.value ? fill(listing.value.title, row.value, filled.value) || titleOf(props.term, row.value, props.id) : ""));
const kindLabel = computed(() => (row.value ? inspectorLabel(listing.value, props.term, row.value, props.id) : ""));
const label = computed(() => (kindLabel.value === title.value ? "" : kindLabel.value));
const description = computed(() => (row.value ? fill(listing.value.description, row.value, filled.value) : ""));
const text = computed(() => row.value?.body || row.value?.brief || (TEXT_NOUNS.has(props.term) ? row.value?.text : "") || "");
const html = computed(() => (text.value ? render(text.value, {env: "", rowNames: false}) : ""));
const fields = computed(() => fieldsOf(row.value, text.value, creator.value, owner.value));

// the comments are a rail beside the body only when the panel is drawn as wide as a wide inspector; a narrower screen keeps them as a tab
const rail = computed(() => listing.value.comments && drawnWidth.value >= INSPECTOR_WIDTHS.wide);
const commentsTab = computed(() => listing.value.comments && !rail.value);
const partsOf = (name) => listing.value.components.filter((component) => (component.tab || "") === name).map((component) => component.window);
const tabNames = computed(() => [...new Set(listing.value.components.map((component) => component.tab).filter(Boolean))]);
const tabs = computed(() => (tabNames.value.length || commentsTab.value
    ? [{key: "details", label: "Details"}, ...tabNames.value.map((name) => ({key: name, label: name})), ...(commentsTab.value ? [{key: "comments", label: "Comments"}] : [])]
    : []));
const linkOptions = computed(() => {
    const links = listing.value.links;
    return links ? {categories: links.categories, open: links.open, outsidePlan: links.excludes_plan, pageSize: links.page_size} : null;
});
const textComments = useTextComments(() => (listing.value.comments && row.value ? {term: props.term, id: props.id, title: row.value.title} : {}), (line) => props.read(line));

async function load() {
    const turn = ++reading;
    const answer = await props.read(fill(listing.value.reads, null, filled.value).split(/\s+/).filter(Boolean));
    if (turn !== reading) return;
    failure.value = answer.ok ? "" : answer.error;
    if (!answer.ok) return;
    row.value = answer.value;
    const people = await peopleOf(props.read, row.value);
    if (turn !== reading) return;
    creator.value = people.creator;
    owner.value = people.owner;
}

// a different row starts again; an event reload keeps what is drawn, so an open action form or a comment draft stays as typed
watch(() => `${props.term}:${props.id}`, () => {
    row.value = null;
    creator.value = "";
    owner.value = "";
    failure.value = "";
    tab.value = "details";
    load();
}, {immediate: true});
useResourceEvents(listing.value.events, load);
watch(textComments.open, (open) => open && commentsTab.value && (tab.value = "comments"));

let watcher = null;
onMounted(() => {
    drawnWidth.value = root.value?.clientWidth ?? 0;
    if (typeof ResizeObserver === "undefined") return;
    watcher = new ResizeObserver(() => (drawnWidth.value = root.value.clientWidth));
    watcher.observe(root.value);
});
onUnmounted(() => watcher?.disconnect());
</script>

<template>
    <aside ref="root" class="inspector" data-inspector>
        <InspectorHead
            :label="label"
            :title="title"
            :description="description"
            :backed="backed"
            :stepped="stepped"
            :embedded="embedded"
            :shareable="listing.shareable"
            :read-only="readOnly"
            :opened="{table: table || `${term}s`, id}"
            @close="emit('close')"
            @back="emit('back')"
            @step="emit('step', $event)"
        />
        <template v-if="failure">
            <p class="failure" role="alert" data-resource-failure>{{ failure }}</p>
        </template>
        <template v-else-if="!row">
            <div class="inspector-wait"><Skeleton /></div>
        </template>
        <template v-else>
            <InspectorActions ref="actionBar">
                <ButtonSlot :name="`row.${term}`" :row="{...row, id, term}" :environment="environment" :read-only="readOnly" @done="load" />
            </InspectorActions>
            <div class="inspector-main">
                <div class="inspector-column">
                    <template v-if="tabs.length">
                        <div class="inspector-tabs" data-inspector-tabs><Segmented :options="tabs" :value="tab" @pick="tab = $event" /></div>
                    </template>
                    <div class="inspector-body" data-inspector-body>
                        <SwitchCase :value="tab">
                            <template #details>
                                <div class="inspector-text">
                                    <template v-if="html && !listing.draws_text">
                                        <div class="md text" data-resource-text v-html="html" />
                                    </template>
                                    <template v-if="listing.lists_fields">
                                        <ResourceFields :fields="fields" @peek="emit('open', $event)" />
                                    </template>
                                </div>
                                <InspectorSections :slot-name="`inspector.${term}`" :names="partsOf('')" :row="{...row, id, term}" />
                            </template>
                            <template #comments>
                                <CommentSide
                                    below
                                    :comments="textComments.comments.value"
                                    :words="textComments.words"
                                    :more="Boolean(textComments.nextPage.value)"
                                    :loading="textComments.loading.value"
                                    :failure="textComments.failure.value"
                                    @more="textComments.loadMore"
                                    @close="tab = 'details'"
                                />
                            </template>
                            <template #default>
                                <InspectorSections :names="partsOf(tab)" :row="{...row, id, term}" />
                            </template>
                        </SwitchCase>
                        <template v-if="linkOptions">
                            <InspectorLinks :model="term" :id="id" :read="read" v-bind="linkOptions" @open="emit('open', $event)" />
                        </template>
                    </div>
                    <template v-if="listing.comments">
                        <QuickCommentBar :send="textComments.send" :count="textComments.total.value" @show="commentsTab && (tab = 'comments')" />
                    </template>
                </div>
                <template v-if="rail">
                    <CommentSide
                        :comments="textComments.comments.value"
                        :words="textComments.words"
                        :more="Boolean(textComments.nextPage.value)"
                        :loading="textComments.loading.value"
                        :failure="textComments.failure.value"
                        @more="textComments.loadMore"
                        @close="() => {}"
                    />
                </template>
            </div>
        </template>
    </aside>
</template>

<style scoped>
.inspector {
    display: flex;
    flex: 1;
    flex-direction: column;
    min-height: 0;
    min-width: 0;
}

.inspector-wait {
    padding: 16px;
}

.inspector-main {
    display: flex;
    flex: 1;
    min-height: 0;
}

.inspector-column {
    display: flex;
    flex: 1;
    flex-direction: column;
    min-width: 0;
}

.inspector-tabs {
    padding: 8px 16px;
    border-bottom: 1px solid var(--border);
}

.inspector-body {
    flex: 1;
    overflow-y: auto;
}

.inspector-text {
    padding: 16px 16px 0;
}

.text {
    line-height: 1.55;
    overflow-wrap: anywhere;
}

.failure {
    margin: 0;
    padding: 16px;
    color: var(--danger);
    font-size: 12.5px;
}
</style>
