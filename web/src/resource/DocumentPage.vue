<script setup>
import {ref} from "vue";
import ResourceBody from "./ResourceBody.vue";
import Comments from "./Comments.vue";
import Highlight from "./Highlight.vue";

defineProps({resource: Object});
const emit = defineEmits(["close"]);
const quote = ref("");
</script>

<template>
    <div class="document">
        <div class="document-body">
            <Highlight @quote="quote = $event">
                <ResourceBody :resource="resource" :comments="false" @close="emit('close')" />
            </Highlight>
        </div>
        <aside class="document-aside">
            <Comments :resource="resource" :quote="quote" @sent="quote = ''" />
        </aside>
    </div>
</template>

<style scoped>
.document {
    display: flex;
    height: 100%;
}

.document-body {
    flex: 2 1 0;
    min-width: 0;
    overflow-y: auto;
    overscroll-behavior: contain;
}

.document-body :deep(.body) {
    max-width: 800px;
    margin: 0 auto;
    padding: 36px 32px 60px;
}

.document-body :deep(.body) > .head {
    margin: -36px -32px 0;
    padding: 36px 32px 8px;
}

.document-aside {
    flex: 1 1 0;
    min-width: 280px;
    max-width: 480px;
    display: flex;
    flex-direction: column;
    min-height: 0;
    border-left: 1px solid var(--border);
    background: var(--side);
}

.document-aside > :deep(.comments) {
    flex: 1;
    min-height: 0;
    overflow-y: auto;
    overscroll-behavior: contain;
    margin: 0;
    padding: 16px 16px 8px;
}

.document-aside > :deep(.comment-write) {
    flex: none;
    position: static;
    margin: 0;
    padding: 8px 16px 14px;
    border-top: 1px solid var(--border);
    background: var(--side);
}
</style>
