<script setup>
import {ref} from "vue";
import Btn from "./Btn.vue";
import Icon from "./Icon.vue";
import MenuPanel from "./MenuPanel.vue";

// One button in two parts: the main part does the usual thing at once, and past a thin divider a narrow arrow part opens a menu of the
// other ways to do it
defineProps({kind: {type: String, default: "ghost"}, small: Boolean, disabled: Boolean, menuLabel: {type: String, default: "More ways"}});
const emit = defineEmits(["main"]);
const arrow = ref(null);
const open = ref(false);
const close = () => (open.value = false);
</script>

<template>
    <span class="split-button">
        <Btn :kind="kind" :small="small" :disabled="disabled" class="split-button-main" @click="emit('main')"><slot /></Btn>
        <span ref="arrow" class="split-button-arrow-place">
            <Btn :kind="kind" :small="small" :disabled="disabled" class="split-button-arrow" :aria-label="menuLabel" :title="menuLabel" :aria-expanded="open" @click="open = !open">
                <Icon name="caret" />
            </Btn>
        </span>
        <template v-if="open">
            <MenuPanel :anchor="arrow" :min-width="220" align="right" @close="close">
                <slot name="menu" :close="close" />
            </MenuPanel>
        </template>
    </span>
</template>

<style scoped>
.split-button {
    display: inline-flex;
    flex: none;
    align-items: stretch;
}

.split-button-arrow-place {
    display: inline-flex;
}

.split-button :deep(.split-button-main) {
    border-top-right-radius: 0;
    border-bottom-right-radius: 0;
}

.split-button :deep(.split-button-arrow) {
    padding-inline: 5px;
    border-left: 1px solid color-mix(in srgb, currentColor 28%, transparent);
    border-top-left-radius: 0;
    border-bottom-left-radius: 0;
}
</style>
