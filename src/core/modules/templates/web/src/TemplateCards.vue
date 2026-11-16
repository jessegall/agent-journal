<script setup>
import {computed, ref} from "vue";
import {Btn, FilterBar, ListReaderLayout, PageHeader, Skeleton, TimeAgo, applyFilter, defaultFilter, optionsOf, useWindow, SwitchCase} from "@journal/window-kit";
import SendTemplate from "./SendTemplate.vue";
import TemplateForm from "./TemplateForm.vue";
import TemplateReader from "./TemplateReader.vue";
import {KIND_WORDS, isOwn} from "./templateForms.js";

// the templates as a list and a reader: a row is the number and the title, its description under it and how long ago it was made, with no word for its kind (the title says it).
// Use opens Send it on a row, and Edit is offered only for a template a user made, never for one a module published
const LIST_WIDTH = 460;
const view = useWindow();
const {rows, failure, loaded} = view.props.templates;
const fields = computed(() => [{key: "applies", label: "Applies to", options: optionsOf(rows.value, (row) => row.targets, (kind) => KIND_WORDS[kind] ?? kind), get: (row) => row.targets}]);
const filter = ref(defaultFilter(fields.value));
const words = ref("");
const shown = computed(() => applyFilter(rows.value, fields.value, filter.value, words.value, ["title", "brief", "purpose"]));
const items = computed(() => shown.value.map((row) => ({id: row.id, title: `${row.id} ${row.title}`, desc: row.brief, row})));
const chosen = ref(null);
const dialog = ref(null);
const ask = (kind, template = null) => (dialog.value = {kind, template});
const place = (item) => ({
    head: `Template ${item.id}`,
    items: [
        {label: "Use", group: "open", run: () => ask("send", item.row)},
        ...(isOwn(item.row) ? [{label: "Edit", group: "own", run: () => ask("edit", item.row)}] : []),
    ],
});
</script>

<template>
    <ListReaderLayout v-model:chosen="chosen" :items="items" :list-width="LIST_WIDTH" :place="place" empty-title="No templates yet" pick-line="Choose a template" data-templates>
        <template #top>
            <PageHeader title="Templates" :count="rows.length">
                <template #primary><Btn small variant="primary" data-template-new @click="ask('new')">New template</Btn></template>
            </PageHeader>
            <FilterBar v-model="filter" v-model:words="words" :fields="fields" :rows="rows" :shown="shown.length" placeholder="Search templates" />
            <template v-if="failure">
                <p class="failure" role="alert" data-templates-failure>{{ failure }}</p>
            </template>
            <SwitchCase :value="dialog?.kind"><template #new><TemplateForm @close="dialog = null" /></template>
            <template #edit><TemplateForm :template="dialog.template" @close="dialog = null" /></template>
            <template #send><SendTemplate :template="dialog.template" @close="dialog = null" /></template></SwitchCase>
        </template>
        <template #empty>
            <template v-if="!loaded"><Skeleton shape="rows" /></template>
            <template v-else>A template is a shape for a task, a plan or a review.</template>
        </template>
        <template #meta="{item}">
            <TimeAgo class="age" :at="item.row.created_at" />
        </template>
        <template #reader="{item}">
            <TemplateReader :template="item.row" @send="ask('send', item.row)" @edit="ask('edit', item.row)" />
        </template>
    </ListReaderLayout>
</template>

<style scoped>
.age {
    color: var(--text-3);
    font-size: 12px;
    white-space: nowrap;
}

.failure {
    margin: 0;
    padding: 6px var(--inset);
    color: var(--bad, var(--text-2));
    font-size: 12px;
}
</style>
