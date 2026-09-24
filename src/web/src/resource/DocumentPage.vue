<script setup>
import {computed, nextTick, provide, ref, watch} from "vue";
import {route} from "../route.js";
import {rows} from "../sync/rows.js";
import ResourceBody from "./ResourceBody.vue";
import Comments from "./Comments.vue";
import Links from "./Links.vue";
import Highlight from "./Highlight.vue";

const props = defineProps({resource: Object, focus: {type: Number, default: 0}, shown: {type: Array, default: () => []}});
const emit = defineEmits(["close"]);
const quote = ref("");
const shownAlready = computed(() => [
    ...props.shown,
    ...((props.resource.data || {}).phases || []).flatMap((ph) => (ph.todos || []).map((n) => `todo:${n}`)),
]);
const count = computed(() => rows("comment").filter((c) => c.refs.includes(props.resource.ref) && !c.deleted).length);
const talking = ref(props.focus > 0);
const shifted = ref(talking.value);
const panel = ref(talking.value);
watch(quote, (q) => q && (talking.value = true));
watch(
    () => props.focus,
    (focus) => focus && (talking.value = true),
    {immediate: true}
);
watch(talking, (on) => {
    if (on) {
        if (shifted.value) panel.value = true;
        else shifted.value = true;
    } else if (panel.value) panel.value = false;
    else shifted.value = false;
});

function shiftedDone(event) {
    if (event.propertyName === "transform" && talking.value) panel.value = true;
}

function panelLeft() {
    if (talking.value) panel.value = true;
    else shifted.value = false;
}

provide("talk", {talking, count, toggle: () => (talking.value = !talking.value), say: (text) => (quote.value = text)});
const body = ref(null);
const LIT_FOR = 2500;

function sectionAt(part) {
    const sections = [...(body.value?.querySelectorAll(".section") || [])];
    const lines = part.match(/^(\d+)(?:-\d+)?$/);
    if (!lines) return sections.find((el) => el.querySelector("h3")?.textContent.trim().toLowerCase() === part.toLowerCase());
    let at = (props.resource.brief || "").split("\n").length;
    const index = props.resource.sections.findIndex((section) => {
        at += 1 + (section.body || "").split("\n").length;
        return at >= Number(lines[1]);
    });
    return sections[index < 0 ? sections.length - 1 : index];
}

watch(
    () => [route.value.sub, props.resource.n],
    async ([sub]) => {
        if (!sub) return;
        await nextTick();
        const found = sectionAt(decodeURIComponent(sub));
        if (!found) return;
        found.scrollIntoView({block: "start", behavior: "smooth"});
        found.classList.add("part-lit");
        setTimeout(() => found.classList.remove("part-lit"), LIT_FOR);
    },
    {immediate: true}
);
</script>

<template>
    <div :class="['document', {shifted}]">
        <div ref="body" class="document-body" @transitionend.self="shiftedDone">
            <Highlight :off="!!resource.data?.system" @quote="quote = $event">
                <slot>
                    <ResourceBody :resource="resource" :comments="false" :links="false" @close="emit('close')" />
                </slot>
                <div class="document-links">
                    <Links :resource="resource" :except="shownAlready" />
                </div>
            </Highlight>
        </div>
        <Transition name="aside" @after-leave="panelLeft">
            <aside v-if="panel" class="document-aside">
                <Comments :resource="resource" :quote="quote" :focus="props.focus" @sent="quote = ''" />
            </aside>
        </Transition>
    </div>
</template>

<style scoped>
.document {
    --comments-width: clamp(280px, 34%, 400px);
    position: relative;
    height: 100%;
    overflow: hidden;
}

.document-body {
    position: relative;
    height: 100%;
    min-width: 0;
    overflow-x: hidden;
    overflow-y: auto;
    overscroll-behavior: contain;
    animation: curtain-left 0.32s cubic-bezier(0.2, 0.8, 0.2, 1) backwards;
    transition: transform 0.28s cubic-bezier(0.2, 0.8, 0.2, 1);
}

.document.shifted .document-body {
    transform: translateX(calc(var(--comments-width) / -2));
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

.document-links {
    max-width: 800px;
    margin: 0 auto;
    padding: 0 32px 60px;
}

.document-links:empty {
    display: none;
}

.document-body :deep(.body) {
    max-width: 800px;
    margin: 0 auto;
    padding: 36px 32px 60px;
}

.document-body :deep(.body.agent-page) {
    max-width: none;
    padding: 0 24px 24px;
}

.document-body :deep(.body) > .head {
    margin: -36px -32px 0;
    padding: 36px 32px 8px;
}

@media (max-width: 640px) {
    .document-body :deep(.body) {
        padding: 20px 18px 40px;
    }

    .document-body :deep(.body) > .head {
        margin: -20px -18px 0;
        padding: 20px 18px 8px;
    }

    .document-links {
        padding: 0 18px 40px;
    }
}

.document-aside {
    position: absolute;
    inset: 0 0 0 auto;
    width: var(--comments-width);
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

.document-aside.aside-enter-active,
.document-aside.aside-leave-active {
    transition:
        transform 0.28s cubic-bezier(0.2, 0.8, 0.2, 1),
        opacity 0.2s ease;
}

.document-aside.aside-enter-from,
.document-aside.aside-leave-to {
    transform: translateX(100%);
    opacity: 0;
}

.document-body :deep(.section.part-lit) {
    border-radius: 8px;
    background: color-mix(in srgb, var(--accent) 12%, transparent);
    box-shadow: 0 0 0 6px color-mix(in srgb, var(--accent) 12%, transparent);
    transition:
        background 0.6s ease,
        box-shadow 0.6s ease;
}
</style>
