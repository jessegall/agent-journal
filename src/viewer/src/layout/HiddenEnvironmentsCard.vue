<script setup>
import {ref} from "vue";
import {remember, remembered} from "../platform/storage.js";
import Btn from "../kit/Btn.vue";

const KEY = "journal.hiddenEnvironments.seen";

const visible = ref(!remembered(KEY, false));
remember(KEY, true);
</script>

<template>
    <div v-if="visible" class="card" role="status">
        <span class="text">Colleagues' environments are no longer shown unless their chat is shared.</span>
        <Btn small @click="visible = false">Got it</Btn>
    </div>
</template>

<style scoped>
.card {
    flex: none;
    display: flex;
    align-items: center;
    gap: 10px;
    padding: 6px 16px 6px 20px;
    border-bottom: 1px solid color-mix(in srgb, var(--accent) 40%, var(--border));
    background: color-mix(in srgb, var(--accent) 12%, var(--bg));
    font-size: 12.5px;
    color: var(--text-2);
}

.text {
    flex: 1;
    min-width: 0;
}
</style>
