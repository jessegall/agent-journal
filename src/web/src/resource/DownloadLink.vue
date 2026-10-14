<script setup>
import Icon from "../kit/Icon.vue";
import {useScope} from "../composables/scope.js";

defineProps({resource: Object});
const scope = useScope();
</script>

<template>
    <a
        class="download"
        :href="scope.api.markdownUrl(resource.type, resource.n)"
        :download="`${resource.title}.md`"
        title="Download as Markdown"
    >
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
