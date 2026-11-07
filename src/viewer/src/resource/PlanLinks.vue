<script setup>
import {ref, watch} from "vue";
import FoldGroup from "../kit/FoldGroup.vue";
import {useResourceEvents} from "./resourceEvents.js";
import ResourceLinks from "../../kit/ResourceLinks.vue";

const props = defineProps({id: {type: Number, required: true}, documentId: {type: Number, default: 0}, read: {type: Function, required: true}});
defineEmits(["open"]);
const open = ref(false);
const total = ref(0);
const changes = ref(0);
const failure = ref("");
let reading = 0;
async function load() {
    const turn = ++reading;
    const answer = await props.read(["link", "list", "--row", `plan:${props.id}`, "--group-counterparts", "--outside-plan", "--page-size", "1"]);
    if (turn !== reading) return;
    failure.value = answer.ok ? "" : answer.error;
    if (answer.ok) total.value = answer.value.total;
    changes.value += 1;
}
watch(() => props.id, () => { open.value = false; total.value = 0; load(); }, {immediate: true});
useResourceEvents(["link.*", "phase.*", "phase_task.*"], load);
</script>

<template>
    <template v-if="total"><FoldGroup label="Links" :count="total" :open="open" flush data-plan-links @toggle="open = !open">
        <ResourceLinks model="plan" :id="id" :document-id="documentId" :read="read" :changes="changes" outside-plan grouped link-attribute="data-plan-link" @open="$emit('open', $event)" />
    </FoldGroup></template>
    <template v-if="failure"><p role="alert">{{ failure }}</p></template>
</template>
