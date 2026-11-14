<script setup>
import {computed} from "vue";
import {SwitchCase} from "@journal/window-kit";
import SettingChoiceField from "./SettingChoiceField.vue";
import SettingSegments from "./SettingSegments.vue";

// the context size of one helper type: the size of its kind of agent, a size of its own, or no cap. It says which
// of the three holds and what the size of its kind is, and gives the new mode with the size that goes with it.
const props = defineProps({
    mode: {type: String, required: true},
    kindValue: {type: Number, default: null},
    ownValue: {type: Number, default: null},
    sizes: {type: Array, required: true},
    disabled: {type: Boolean, default: false},
});
const emit = defineEmits(["change"]);

const MODES = [{value: "kind", label: "Same cap as its type"}, {value: "own", label: "A separate cap"}, {value: "none", label: "No cap"}];
const kindText = computed(() => (props.kindValue === null ? "No cap for its type, set in Advanced" : `${props.kindValue / 1000}k for its type, set in Advanced`));
const ownSize = computed(() => props.ownValue ?? props.sizes[0]);

function choose(mode) {
    emit("change", {mode, size: mode === "own" ? ownSize.value : null});
}
</script>

<template>
    <div class="setting-three-way">
        <SettingSegments :model-value="mode" :options="MODES" :disabled="disabled" @update:model-value="choose" />
        <SwitchCase :value="mode">
            <template #kind>
                <span class="line" data-cap-line>{{ kindText }}</span>
            </template>
            <template #own>
                <SettingChoiceField :model-value="ownSize" :choices="sizes" :disabled="disabled" data-cap-own @update:model-value="(size) => emit('change', {mode: 'own', size})" />
            </template>
            <template #none>
                <span class="line" data-cap-line>This type is never compacted at a size</span>
            </template>
        </SwitchCase>
    </div>
</template>

<style scoped>
.setting-three-way { display: flex; flex-direction: column; align-items: flex-start; gap: 6px; }
.line { color: var(--text-3); font-size: 11.5px; }
</style>
