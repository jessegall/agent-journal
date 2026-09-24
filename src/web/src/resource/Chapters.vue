<script setup>
import {computed, nextTick, onMounted, onUnmounted, ref} from "vue";
import DropList from "../kit/DropList.vue";

const props = defineProps({sections: {type: Array, required: true}, body: {type: Object, default: null}});
const at = ref(0);
const numbered = computed(() => !props.sections.some((s) => /^\d/.test(s.title)));
const items = computed(() => props.sections.map((s, i) => ({key: String(i), label: s.title, lead: numbered.value ? String(i + 1) : ""})));
const label = computed(() => `${at.value + 1} of ${props.sections.length} · ${props.sections[at.value]?.title || ""}`);
const parts = () => [...(props.body?.querySelectorAll(".section.reading") || [])];
const headHeight = () => props.body?.querySelector(".head")?.offsetHeight || 0;
const AHEAD = 24;
let frame = 0;

function track(event) {
    const scroller = event.target;
    if (!(scroller instanceof Element) || !scroller.contains(props.body)) return;
    cancelAnimationFrame(frame);
    frame = requestAnimationFrame(() => {
        const edge = scroller.getBoundingClientRect().top + headHeight() + AHEAD;
        const passed = parts().filter((el) => el.getBoundingClientRect().top <= edge).length;
        const bottom = scroller.scrollTop + scroller.clientHeight >= scroller.scrollHeight - 2;
        at.value = bottom && scroller.scrollTop > 0 ? props.sections.length - 1 : Math.max(0, passed - 1);
    });
}

async function jump(item) {
    const part = parts()[Number(item.key)];
    if (!part) return;
    part.closest(".folded-body")?.dispatchEvent(new Event("reveal"));
    await nextTick();
    part.style.scrollMarginTop = `${headHeight() + 12}px`;
    part.scrollIntoView({block: "start", behavior: "smooth"});
    part.classList.add("part-lit");
    setTimeout(() => part.classList.remove("part-lit"), 1600);
}

onMounted(() => document.addEventListener("scroll", track, true));
onUnmounted(() => {
    document.removeEventListener("scroll", track, true);
    cancelAnimationFrame(frame);
});
</script>

<template>
    <div class="chapters">
        <DropList icon="chapters" :label="label" :items="items" :picked="String(at)" @pick="jump" />
    </div>
</template>

<style scoped>
.chapters {
    display: flex;
    margin-top: 8px;
}

.chapters :deep(.menu-panel) {
    max-width: min(520px, calc(100vw - 36px));
}
</style>
