<script setup>
import {ref, watch} from "vue";
import FoldSign from "./FoldSign.vue";
import ResourceLinks from "../../kit/ResourceLinks.vue";
import {useResourceEvents} from "../resource/resourceEvents.js";

// the links section of an inspector: folded to one line with the count, and open at a fixed height with the kind tabs pinned above the scrolling rows
const props = defineProps({
    model: {type: String, required: true},
    id: {type: Number, required: true},
    read: {type: Function, required: true},
    documentId: {type: Number, default: 0},
    kinds: {type: Array, default: () => []},
    open: Boolean,
    outsidePlan: Boolean,
    pageSize: {type: Number, default: 10},
});
defineEmits(["open"]);
const unfolded = ref(props.open);
const total = ref(0);
const changes = ref(0);
const failure = ref("");
let reading = 0;

async function load() {
    const turn = ++reading;
    const line = ["link", "list", "--row", `${props.model}:${props.id}`, "--group-counterparts", ...(props.outsidePlan ? ["--outside-plan"] : []), "--page-size", "1"];
    const answer = await props.read(line);
    if (turn !== reading) return;
    failure.value = answer.ok ? "" : answer.error;
    if (answer.ok) total.value = answer.value.total;
    changes.value += 1;
}

watch(() => `${props.model}:${props.id}`, () => {
    unfolded.value = props.open;
    total.value = 0;
    load();
}, {immediate: true});
useResourceEvents(["link.*", "phase.*", "phase_task.*"], load);
</script>

<template>
    <template v-if="total">
        <section class="inspector-links" data-inspector-links>
            <button type="button" class="links-head" :aria-expanded="unfolded" data-inspector-links-head @click="unfolded = !unfolded">
                <span class="links-label">Links</span>
                <span class="links-count" data-inspector-links-count>{{ total }}</span>
                <FoldSign :open="unfolded" />
            </button>
            <div :class="['links-body', {unfolded}]">
                <template v-if="unfolded">
                    <div class="links-fixed" data-inspector-links-body>
                        <ResourceLinks
                            pinned
                            :model="model"
                            :id="id"
                            :document-id="documentId"
                            :read="read"
                            :changes="changes"
                            :outside-plan="outsidePlan"
                            :page-size="pageSize"
                            :only-kinds="kinds"
                            link-attribute="data-inspector-link"
                            @open="$emit('open', $event)"
                        />
                    </div>
                </template>
            </div>
        </section>
    </template>
    <template v-if="failure">
        <p class="links-failure" role="alert" data-inspector-links-failure>{{ failure }}</p>
    </template>
</template>

<style scoped>
.links-head {
    display: flex;
    align-items: center;
    gap: 6px;
    width: 100%;
    padding: 10px 16px;
    border: 0;
    background: none;
    color: var(--text-2);
    font: inherit;
    font-size: 12.5px;
    font-weight: 500;
    text-align: left;
    cursor: pointer;
}

.links-head:hover {
    color: var(--text);
}

.links-count {
    color: var(--text-3);
    font-size: 11.5px;
}

.links-body {
    max-height: 0;
    overflow: hidden;
    transition: max-height 0.25s ease;
}

.links-body.unfolded {
    max-height: 280px;
}

.links-fixed {
    box-sizing: border-box;
    height: 280px;
    padding: 0 16px 12px;
}

.links-failure {
    margin: 0;
    padding: 8px 16px;
    color: var(--danger);
    font-size: 12.5px;
}

@media (prefers-reduced-motion: reduce) {
    .links-body {
        transition: none;
    }
}
</style>
