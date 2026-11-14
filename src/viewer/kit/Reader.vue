<script setup>
import {computed, ref, watch} from "vue";
import ResourceFields from "../src/resource/ResourceFields.vue";
import ResourceHeading from "../src/resource/ResourceHeading.vue";
import InnerTabs from "./InnerTabs.vue";

// the right side of a list-and-reader page: the head (its number and agent chip, the title and its abstract, then the primary button and the
// Actions menu at the right edge), the tabs under it, a Facts block and then the body of the open tab. The title and abstract are ResourceHeading,
// the tabs are InnerTabs and the facts are ResourceFields, the same pieces an inspector is drawn from.
const props = defineProps({
    title: {type: String, required: true},
    number: {type: String, default: ""},
    abstract: {type: String, default: ""},
    tabs: {type: Array, default: () => []},
    facts: {type: Array, default: () => []},
});
const emit = defineEmits(["peek"]);
const open = ref(props.tabs[0]?.key ?? "");
watch(() => props.tabs.map((tab) => tab.key).join(), () => {
    if (!props.tabs.some((tab) => tab.key === open.value)) open.value = props.tabs[0]?.key ?? "";
});
// InnerTabs counts a tab from the answer's field the tab names
const bands = computed(() => props.tabs.map((tab) => ({key: tab.key, label: tab.label, count_field: tab.count != null ? `count_${tab.key}` : ""})));
const active = computed(() => bands.value.find((band) => band.key === open.value) ?? null);
const counts = computed(() => Object.fromEntries(props.tabs.filter((tab) => tab.count != null).map((tab) => [`count_${tab.key}`, tab.count])));
</script>

<template>
    <article class="reader" data-reader>
        <header class="reader-head" data-reader-head>
            <div class="reader-meta">
                <span v-if="number" class="reader-number" data-reader-number>{{ number }}</span>
                <slot name="agent" />
            </div>
            <div class="reader-title-line">
                <ResourceHeading :title="title" :abstract="abstract" />
                <span class="reader-buttons">
                    <slot name="primary" />
                    <slot name="actions" />
                </span>
            </div>
        </header>
        <template v-if="tabs.length">
            <InnerTabs :tabs="bands" :active="active" :answer="counts" @choose="open = $event.key" />
        </template>
        <div class="reader-body">
            <template v-if="facts.length">
                <ResourceFields :fields="facts" @peek="emit('peek', $event)" />
            </template>
            <slot :tab="open" />
        </div>
    </article>
</template>

<style scoped>
.reader {
    display: flex;
    flex: 1;
    flex-direction: column;
    min-width: 0;
}

.reader-head {
    padding: 14px var(--inset) 12px;
    border-bottom: 1px solid var(--border);
}

.reader-meta {
    display: flex;
    align-items: center;
    gap: var(--s2);
    min-height: 18px;
    color: var(--text-3);
    font-size: 12px;
}

.reader-number {
    font-family: var(--mono);
    font-variant-numeric: tabular-nums;
}

.reader-title-line {
    display: flex;
    align-items: flex-start;
    gap: var(--s3);
    margin-top: 4px;
}

.reader-buttons {
    display: flex;
    flex: none;
    align-items: center;
    gap: var(--s2);
}

.reader-body {
    flex: 1;
    min-width: 0;
    padding: 0 var(--inset) 24px;
}
</style>
