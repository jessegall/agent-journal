<script setup>
import {ref} from "vue";
import Btn from "./Btn.vue";
import Icon from "./Icon.vue";
import MenuPanel from "./MenuPanel.vue";
import TimingForm from "./TimingForm.vue";

defineProps({
    timing: {type: Object, required: true},
    label: {type: String, default: ""},
    prefix: {type: String, default: ""},
    sheet: Boolean,
});
const emit = defineEmits(["change"]);

const open = ref(false);
const chip = ref(null);
</script>

<template>
    <span class="timing">
        <button ref="chip" type="button" :class="['timing-chip', {open}]" title="Change how often" @click="open = !open">
            <Icon name="clock" :size="12" />
            {{ prefix }} {{ timing.words }}
        </button>
        <template v-if="open">
            <template v-if="sheet">
                <div class="timing-scrim" @click="open = false" />
                <div class="timing-sheet" role="dialog" :aria-label="label">
                    <span class="timing-grab" />
                    <TimingForm sheet :timing="timing" :label="label" @change="emit('change', $event)" />
                    <Btn kind="primary" large fill @click="open = false">Done</Btn>
                </div>
            </template>
            <template v-else>
                <MenuPanel
                    plain
                    :anchor="chip"
                    :min-width="300"
                    :max-width="300"
                    :height="250"
                    role="dialog"
                    :aria-label="label"
                    @close="open = false"
                >
                    <TimingForm :timing="timing" :label="label" @change="emit('change', $event)" />
                </MenuPanel>
            </template>
        </template>
    </span>
</template>

<style scoped>
.timing {
    display: inline-flex;
}

.timing-chip {
    display: inline-flex;
    align-items: center;
    gap: 6px;
    height: 24px;
    padding: 0 9px;
    border: 1px solid var(--border-2);
    border-radius: 6px;
    background: var(--bg-2);
    color: var(--text-2);
    font: inherit;
    font-size: 12px;
    white-space: nowrap;
    cursor: pointer;
}

.timing-chip:hover,
.timing-chip.open {
    border-color: var(--accent);
    color: var(--text);
}

.timing-sheet {
    position: fixed;
    right: 0;
    bottom: 0;
    left: 0;
    z-index: 60;
    display: flex;
    flex-direction: column;
    gap: 14px;
    padding: 10px 18px 34px;
    border: 1px solid var(--border-2);
    border-width: 1px 0 0;
    border-radius: 16px 16px 0 0;
    background: var(--bg);
    box-shadow: var(--shadow);
}

.timing-scrim {
    position: fixed;
    inset: 0;
    z-index: 59;
    background: var(--scrim, rgba(0, 0, 0, 0.5));
}

.timing-grab {
    align-self: center;
    width: 36px;
    height: 4px;
    border-radius: 2px;
    background: var(--border-3);
}

.timing-sheet :deep(.btn) {
    justify-content: center;
}

.timing-sheet :deep(.btn-label) {
    flex: none;
}
</style>
