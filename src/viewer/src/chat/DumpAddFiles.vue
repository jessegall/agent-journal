<script setup>
import Icon from "../kit/Icon.vue";

const emit = defineEmits(["files"]);

function picked(e) {
    emit("files", e.target.files);
    e.target.value = "";
}
</script>

<template>
    <label class="dump-add">
        <Icon name="paperclip" :size="13" />
        <slot />
        <input type="file" multiple hidden @change="picked" />
    </label>
</template>

<style scoped>
.dump-add {
    display: inline-flex;
    align-items: center;
    gap: 7px;
    padding: 4px 6px;
    border-radius: 6px;
    color: var(--text-3);
    font-size: 12.5px;
    cursor: pointer;
}

.dump-add:hover {
    color: var(--text);
}
</style>
