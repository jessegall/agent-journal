<script setup>
defineProps({skill: {type: Object, default: null}, failure: {type: String, default: ""}});
const emit = defineEmits(["back"]);
</script>

<template>
    <div class="skills">
        <button type="button" class="skills-back" @click="emit('back')">Back</button>
        <h3 class="skills-title">{{ skill ? skill.folder : "" }}</h3>
        <pre class="skills-text">{{ skill ? skill.text : failure }}</pre>
    </div>
</template>

<style scoped>
.skills-title {
    margin: 0;
    font-size: 13px;
}

.skills-text {
    margin: 0;
    white-space: pre-wrap;
    font-size: 12px;
}
</style>
