<script setup>
import {ref, watch} from "vue";
import {useScope} from "../composables/scope.js";
import {createdAt} from "../domain/row.js";
import {age} from "../format/time.js";
import ResourceBlock from "./ResourceBlock.vue";

const props = defineProps({task: {type: Object, required: true}});
const scope = useScope();
const logs = ref([]);

watch(
    () => [props.task.id, props.task.updated_at],
    async () => (logs.value = await scope.api.taskLogs(props.task.id).catch(() => [])),
    {immediate: true}
);
</script>

<template>
    <template v-if="logs.length">
        <ResourceBlock heading="Log">
            <ol class="logs">
                <template v-for="log in logs" :key="log.id">
                    <li>
                        <span class="line">{{ log.line }}</span>
                        <span class="at">{{ age(createdAt(log)) }}</span>
                    </li>
                </template>
            </ol>
        </ResourceBlock>
    </template>
</template>

<style scoped>
.logs {
    display: flex;
    flex-direction: column;
    gap: 4px;
    margin: 0;
    padding: 0;
    list-style: none;
}

.logs li {
    display: flex;
    gap: 8px;
    font-size: 12.5px;
    color: var(--text-2);
}

.line {
    flex: 1;
}

.at {
    color: var(--text-4);
    white-space: nowrap;
}
</style>
