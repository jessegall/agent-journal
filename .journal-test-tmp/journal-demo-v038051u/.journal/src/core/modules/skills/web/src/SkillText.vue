<script setup>
defineProps({skill: {type: Object, default: null}, failure: {type: String, default: ""}, back: {type: Boolean, default: true}});
const emit = defineEmits(["back"]);
</script>

<template>
    <div class="skills">
        <template v-if="back"><button type="button" class="skills-back" @click="emit('back')">Back to skills</button></template>
        <h3 class="skills-title">{{ skill ? skill.folder : "" }}</h3>
        <pre class="skills-text" data-skill-text>{{ skill ? skill.text : failure }}</pre>
    </div>
</template>

<style scoped>
.skills-title {
    margin: 0;
    font-size: 13px;
}
.skills-back { padding: 5px 8px; border: 1px solid var(--border); border-radius: 6px; background: transparent; color: var(--text-2); font: inherit; cursor: pointer; }

.skills-text {
    margin: 0;
    white-space: pre-wrap;
    font-size: 12px;
}
</style>
