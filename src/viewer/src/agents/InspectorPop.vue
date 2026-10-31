<script setup>
import {onMounted, onUnmounted} from "vue";
import CloseButton from "../kit/CloseButton.vue";
import MenuPanel from "../kit/MenuPanel.vue";

defineProps({
    anchor: {type: Object, required: true},
    title: {type: String, required: true},
    sub: {type: String, default: ""},
    width: {type: Number, default: 540},
});
const emit = defineEmits(["close"]);
const onKey = (event) => event.key === "Escape" && emit("close");
onMounted(() => window.addEventListener("keydown", onKey));
onUnmounted(() => window.removeEventListener("keydown", onKey));
</script>

<template>
    <MenuPanel class="inspector-pop" :anchor="anchor" :min-width="Math.min(width, 240)" :max-width="width" :max-height="380" :gap="8" plain @close="emit('close')">
        <div class="pop-head">
            <strong>{{ title }}</strong>
            <template v-if="sub">
                <span class="sub">{{ sub }}</span>
            </template>
            <span class="grow"></span>
            <CloseButton :title="`Close the ${title.toLowerCase()}`" @click="emit('close')" />
        </div>
        <div class="pop-body"><slot /></div>
    </MenuPanel>
</template>

<style scoped>
.inspector-pop {
    width: max-content;
    padding: 12px 14px 14px;
    border-color: var(--border-3);
    background: var(--hover);
}

.pop-head {
    display: flex;
    align-items: center;
    gap: 8px;
    margin: -4px -6px 8px 0;
}

.pop-head strong {
    font-size: 12.5px;
    font-weight: 600;
}

.sub {
    color: var(--text-3);
    font-size: 12px;
}

.grow {
    flex: 1;
}

.pop-body {
    overflow-y: auto;
    scrollbar-width: thin;
}
</style>
