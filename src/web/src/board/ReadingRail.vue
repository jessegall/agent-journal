<script setup>
import {computed} from "vue";
import FileSlip from "../kit/FileSlip.vue";
import ProgressBar from "../kit/ProgressBar.vue";
import DocumentOutline from "./DocumentOutline.vue";

const props = defineProps({
    name: {type: String, default: ""},
    sections: {type: Array, required: true},
    drafted: {type: Number, default: 0},
    pointed: {type: Object, default: null},
});
const settled = computed(() => props.sections.filter((s) => s.state && s.state !== "now").length);
const done = computed(() => settled.value === props.sections.length);
const at = computed(() => {
    const now = props.sections.findIndex((s) => s.state === "now");
    return (now < 0 ? settled.value : now) + 1;
});
const meta = computed(() =>
    done.value
        ? `Read · ${props.drafted} ${props.drafted === 1 ? "draft" : "drafts"}`
        : `Reading section ${Math.min(at.value, props.sections.length)} of ${props.sections.length}`
);
const lit = computed(() => {
    if (!props.pointed) return "";
    const id = String(props.pointed.data.source_id || "");
    const numbered = id.match(/^§\s*(\d+)/);
    if (numbered && props.sections[numbered[1] - 1]) return props.sections[numbered[1] - 1].title;
    const said = `${id} ${props.pointed.title}`.toLowerCase();
    return props.sections.find((s) => said.includes(s.title.toLowerCase()))?.title || "";
});
</script>

<template>
    <div class="reading-rail">
        <FileSlip :file="{name: name || 'The document'}" :meta="meta" :read="settled / sections.length" />
        <ProgressBar thin :value="settled" :max="sections.length" :tone="done ? 'good' : ''" />
        <DocumentOutline :sections="sections" :lit="lit" />
    </div>
</template>

<style scoped>
.reading-rail {
    display: flex;
    flex-direction: column;
    gap: 14px;
    min-height: 0;
    overflow-y: auto;
    scrollbar-width: none;
}

.reading-rail > * {
    flex: none;
}

.reading-rail > :deep(.track) {
    margin: -4px 2px 0;
}
</style>
