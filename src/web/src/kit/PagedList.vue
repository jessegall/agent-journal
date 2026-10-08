<script setup>
import {onUnmounted, ref} from "vue";
import {useSighted} from "../composables/scrollback.js";
import Btn from "./Btn.vue";

const props = defineProps({shown: Number, total: Number, more: Boolean, load: Function});
const end = ref(null);
const loading = ref(false);
const scrolled = ref(false);
const moved = () => (scrolled.value = true);

async function next() {
    if (loading.value || !props.more) return;
    loading.value = true;
    try {
        await props.load();
    } finally {
        loading.value = false;
    }
}

useSighted(end, () => scrolled.value && next());
window.addEventListener("wheel", moved, {passive: true});
window.addEventListener("touchmove", moved, {passive: true});
onUnmounted(() => {
    window.removeEventListener("wheel", moved);
    window.removeEventListener("touchmove", moved);
});
</script>

<template>
    <slot />
    <template v-if="more">
        <div class="paged-foot">
            <span class="paged-count">Showing {{ shown }} of {{ total }}</span>
            <Btn class="paged-more" :busy="loading" @click="next">Load more</Btn>
        </div>
    </template>
    <div ref="end" class="paged-end" />
</template>

<style scoped>
.paged-foot {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 12px;
    padding: 16px;
    color: var(--text-3);
}
</style>
