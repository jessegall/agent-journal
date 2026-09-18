<script setup>
import {computed, ref, watch} from "vue";
import Btn from "../kit/Btn.vue";
import Icon from "../kit/Icon.vue";
import {rows} from "../store.js";
import ResourceBody from "./ResourceBody.vue";
import Comments from "./Comments.vue";
import Highlight from "./Highlight.vue";

const props = defineProps({resource: Object});
const emit = defineEmits(["close"]);
const quote = ref("");
const count = computed(() => rows("comment").filter((c) => c.refs.includes(props.resource.ref) && !c.deleted).length);
const talking = ref(count.value > 0);
watch(quote, (q) => q && (talking.value = true));
</script>

<template>
    <div :class="['document', {talking}]">
        <div class="document-body">
            <div class="document-tools">
                <Btn small :class="{on: talking}" @click="talking = !talking">
                    <Icon name="bubble" :size="12" />
                    {{ count ? `${count} comment${count === 1 ? "" : "s"}` : "Comment" }}
                </Btn>
            </div>
            <Highlight @quote="quote = $event">
                <slot>
                    <ResourceBody :resource="resource" :comments="false" @close="emit('close')" />
                </slot>
            </Highlight>
        </div>
        <Transition name="aside">
            <aside v-if="talking" class="document-aside">
                <Comments :resource="resource" :quote="quote" @sent="quote = ''" />
            </aside>
        </Transition>
    </div>
</template>

<style scoped>
.document {
    display: flex;
    height: 100%;
    overflow: hidden;
}

.document-body {
    position: relative;
    flex: 2 1 0;
    min-width: 0;
    overflow-y: auto;
    overscroll-behavior: contain;
    animation: curtain-left 0.32s cubic-bezier(0.2, 0.8, 0.2, 1) both;
}

.document-tools {
    position: sticky;
    top: 10px;
    z-index: 3;
    display: flex;
    justify-content: flex-end;
    height: 0;
    padding: 0 16px;
}

.document-tools .btn.on {
    border-color: var(--accent);
    color: var(--accent-text);
}

.aside-enter-active,
.aside-leave-active {
    transition:
        flex-basis 0.28s cubic-bezier(0.2, 0.8, 0.2, 1),
        min-width 0.28s cubic-bezier(0.2, 0.8, 0.2, 1),
        opacity 0.2s ease;
    overflow: hidden;
}

.aside-enter-from,
.aside-leave-to {
    flex-basis: 0;
    min-width: 0;
    opacity: 0;
}

@keyframes curtain-left {
    from {
        opacity: 0;
        transform: translateX(-28px);
    }

    to {
        opacity: 1;
        transform: none;
    }
}

@keyframes curtain-right {
    from {
        opacity: 0;
        transform: translateX(28px);
    }

    to {
        opacity: 1;
        transform: none;
    }
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
    animation: curtain-right 0.32s cubic-bezier(0.2, 0.8, 0.2, 1) 0.08s both;
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
