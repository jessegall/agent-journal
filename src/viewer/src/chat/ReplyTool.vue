<script setup>
defineProps({title: {type: String, default: "Reply to this, quoting it"}, label: {type: String, default: "Reply"}});
const emit = defineEmits(["reply"]);
</script>

<template>
    <button type="button" class="thread-tool" :title="title" @click.stop="emit('reply')">{{ label }}</button>
</template>
