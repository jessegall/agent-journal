<script setup>
import {api} from "../api/client.js";
import Icon from "../kit/Icon.vue";

defineProps({resource: Object});
</script>

<template>
    <a class="download" :href="api.markdownUrl(resource.type, resource.n)" :download="`${resource.title}.md`" title="Download as Markdown">
        <Icon name="download" />
    </a>
</template>

<style scoped>
.download {
    display: grid;
    place-items: center;
    width: 26px;
    height: 26px;
    border-radius: 6px;
    color: var(--text-3);
}

.download:hover {
    background: var(--hover);
    color: var(--text);
}
</style>
