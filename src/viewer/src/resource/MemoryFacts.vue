<script setup>
import TaskFact from "../tasks/TaskFact.vue";
import {ago} from "../format/time.js";
import {createdAt, updatedAt} from "../domain/row.js";

// What a memory holds besides its words: its weight, which every compaction lowers by one, when it was added and when it was last weighed
defineProps({resource: {type: Object, required: true}});
</script>

<template>
    <div class="memory-facts">
        <TaskFact label="Weight">{{ resource.weight }}</TaskFact>
        <TaskFact label="Added">{{ ago(createdAt(resource)) }}</TaskFact>
        <TaskFact label="Last weighed">{{ ago(updatedAt(resource)) }}</TaskFact>
    </div>
</template>

<style scoped>
.memory-facts {
    display: flex;
    flex-wrap: wrap;
    gap: 10px 24px;
    margin-top: 14px;
}
</style>
