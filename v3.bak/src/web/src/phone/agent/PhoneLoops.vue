<script setup>
import {computed} from "vue";
import {loopRows, loopSet, loopWhen} from "../../domain/loops.js";
import Cell from "../kit/Cell.vue";
import CellGroup from "../kit/CellGroup.vue";
import EmptyList from "../kit/EmptyList.vue";
import PhonePage from "../settings/PhonePage.vue";
import PhoneNoAgent from "./PhoneNoAgent.vue";
import {useLeadAgent} from "./lead.js";

defineProps({target: {type: String, default: ""}, back: {type: String, default: ""}});
const emit = defineEmits(["back"]);
const {data, loaded} = useLeadAgent();
const loops = computed(() => loopRows(data.value && data.value.loops));
</script>

<template>
    <PhonePage title="Repeating prompts" line="Prompts the agent set to run again on a schedule." :back="back" @back="emit('back')">
        <template v-if="loaded && !data">
            <PhoneNoAgent />
        </template>
        <template v-else-if="loaded && !loops.length">
            <EmptyList icon="loop" title="No repeating prompts" reason="The agent has not set a prompt to run again." />
        </template>
        <template v-else>
            <CellGroup>
                <template v-for="loop in loops" :key="loop.id">
                    <Cell :label="loopWhen(loop.schedule)" :sub="loopSet(loop.at)" still>
                        <span class="loop-prompt">{{ loop.prompt }}</span>
                    </Cell>
                </template>
            </CellGroup>
        </template>
    </PhonePage>
</template>

<style scoped>
.loop-prompt {
    display: block;
    margin-top: 4px;
    color: var(--text-2);
    font-size: 0.875rem;
    white-space: pre-wrap;
    word-break: break-word;
}
</style>
