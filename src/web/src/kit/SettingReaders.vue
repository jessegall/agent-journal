<script setup>
import {href} from "../route.js";
import Chip from "./Chip.vue";

defineProps({readers: {type: Array, required: true}});
</script>

<template>
    <template v-if="readers.length">
        <div class="setting-readers">
            <span class="setting-readers-label">Used by</span>
            <template v-for="reader in readers" :key="reader.id">
                <a class="setting-reader" :href="href.page('chart', reader.id)" :title="`Open the workflow ${reader.workflow}`">
                    <Chip>{{ reader.workflow }}</Chip>
                </a>
            </template>
        </div>
    </template>
</template>

<style scoped>
.setting-readers {
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    gap: 6px;
    margin-top: 6px;
}

.setting-readers-label {
    color: var(--text-3);
    font-size: 12px;
}

.setting-reader {
    text-decoration: none;
}
</style>
