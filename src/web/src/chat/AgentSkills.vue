<script setup>
import Icon from "../kit/Icon.vue";

defineProps({skills: {type: Array, required: true}});
const emit = defineEmits(["read", "browse"]);
</script>

<template>
    <p class="bar-none">Loaded in this window, newest last. A compaction empties it.</p>
    <template v-if="!skills.length">
        <p class="bar-none">None — the agent is working from memory.</p>
    </template>
    <template v-for="s in skills" :key="s">
        <button type="button" class="bar-item" :title="`Read the ${s} skill`" @click="emit('read', s)">
            <Icon name="book" />
            {{ s }}
        </button>
    </template>
    <div class="bar-foot">
        <button type="button" class="bar-act" @click="emit('browse')">Browse every skill</button>
    </div>
</template>

<style scoped>
.bar-foot {
    position: sticky;
    bottom: -6px;
    margin: 4px -6px -6px;
    padding: 6px 6px 6px;
    border-top: 1px solid var(--line);
    background: var(--raised);
}
</style>
