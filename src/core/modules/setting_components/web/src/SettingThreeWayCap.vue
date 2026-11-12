<script setup>
import {computed} from "vue";
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

const MODES = [{value: "kind", label: "Cap of its kind"}, {value: "own", label: "Its own cap"}, {value: "none", label: "No cap"}];
const kindText = computed(() => (props.kindValue === null ? "No cap for its kind, set in Advanced" : `${props.kindValue / 1000}k for its kind, set in Advanced`));
const ownSize = computed(() => props.ownValue ?? props.sizes[0]);

function choose(mode) {
    emit("change", {mode, size: mode === "own" ? ownSize.value : null});
}
</script>

<template>
    <div class="setting-three-way">
        <SettingSegments :model-value="mode" :options="MODES" :disabled="disabled" @update:model-value="choose" />
        <template v-if="mode === 'kind'">
            <span class="line" data-cap-line>{{ kindText }}</span>
        </template>
        <template v-else-if="mode === 'own'">
            <SettingChoiceField :model-value="ownSize" :choices="sizes" :disabled="disabled" data-cap-own @update:model-value="(size) => emit('change', {mode: 'own', size})" />
        </template>
        <template v-else>
            <span class="line" data-cap-line>This type is never compacted at a size</span>
        </template>
    </div>
</template>

<style scoped>
.setting-three-way { display: flex; flex-direction: column; align-items: flex-start; gap: 6px; }
.line { color: var(--text-3); font-size: 11.5px; }
</style>
