<script setup>
import {onBeforeUnmount, ref, watch} from "vue";

// the sections of a tab on its left: a click asks for one by its key, and the one in view is marked. The sections
// are the elements marked data-section inside the scope element, once it is given.
const props = defineProps({sections: {type: Array, required: true}, scope: {type: Object, default: null}, title: {type: String, default: "On this tab"}});
const emit = defineEmits(["choose"]);

const inView = ref("");
let observer = null;

function watchScope() {
    observer?.disconnect();
    if (!props.scope || typeof IntersectionObserver === "undefined") return;
    observer = new IntersectionObserver((seen) => {
        const first = seen.find((entry) => entry.isIntersecting);
        if (first) inView.value = first.target.dataset.section;
    }, {root: props.scope});
    props.scope.querySelectorAll("[data-section]").forEach((section) => observer.observe(section));
}

function choose(key) {
    inView.value = key;
    emit("choose", key);
}

watch(() => [props.scope, props.sections], watchScope, {immediate: true, flush: "post"});
onBeforeUnmount(() => observer?.disconnect());
</script>

<template>
    <nav class="setting-sections" :aria-label="title">
        <span class="head">{{ title }}</span>
        <template v-for="section in sections" :key="section.key">
            <a href="#" :class="{on: section.key === (inView || sections[0]?.key)}" :data-section-link="section.key" @click.prevent="choose(section.key)">{{ section.title }}</a>
        </template>
    </nav>
</template>

<style scoped>
.setting-sections { display: flex; flex-direction: column; gap: 2px; }
.head { padding: 2px 10px 6px; color: var(--text-3); font-size: 11px; }
a { display: block; padding: 6px 10px; border-radius: 6px; color: var(--text-2); font-size: 12.5px; text-decoration: none; }
a:hover { color: var(--text); }
a.on { background: var(--sel); color: var(--text); }
</style>
