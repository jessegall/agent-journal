<script setup>
defineProps({title: {type: String, default: "Reply to this, quoting it"}});
const emit = defineEmits(["reply"]);
</script>

<template>
    <button type="button" class="thread-tool" :title="title" @click.stop="emit('reply')">Reply</button>
</template>
