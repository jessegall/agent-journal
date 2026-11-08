<script setup>
import {computed} from "vue";
import {useWindow} from "@journal/window-kit";

// one setting of the Agent settings window: its name and what it does, the control that changes it, and where its value comes from
const props = defineProps({label: {type: String, required: true}, help: {type: String, default: ""}, source: {type: String, default: ""}, changed: {type: Boolean, default: false}});
const view = useWindow();
const SOURCES = {environment: () => `This environment, ${view.environment}`, project: () => "Every environment", default: () => "Default"};
const sourceText = computed(() => (props.changed ? "Changed, not applied" : SOURCES[props.source]?.() ?? ""));
</script>

<template>
    <div :class="['ctl', {flat: !source}]">
        <div class="ctl-text"><span class="ctl-label">{{ label }}</span><span class="ctl-help">{{ help }}</span></div>
        <div class="ctl-input"><slot /></div>
        <template v-if="source">
            <div class="ctl-src"><span :class="['src', {here: source === 'environment', changed}]" data-setting-source><i />{{ sourceText }}</span></div>
        </template>
    </div>
</template>

<style scoped>
.ctl { display: grid; grid-template-columns: minmax(0, 1fr) 220px 170px; gap: 6px 18px; align-items: center; padding: 10px 0; border-top: 1px solid var(--border-inner, var(--border)); }
.ctl.flat { grid-template-columns: minmax(0, 1fr) 220px; }
.ctl-text { min-width: 0; }
.ctl-label { display: block; color: var(--text); font-size: 13px; }
.ctl-help { display: block; margin-top: 1px; color: var(--text-3); font-size: 12px; text-wrap: pretty; }
.ctl-input { display: flex; flex-wrap: wrap; gap: 6px; align-items: center; min-width: 0; }
.ctl-src { display: flex; flex-direction: column; gap: 2px; align-items: flex-start; color: var(--text-3); font-size: 11.5px; }
.src { display: inline-flex; gap: 5px; align-items: center; }
.src i { width: 6px; height: 6px; border-radius: 50%; background: var(--text-4, var(--text-3)); }
.src.here i { background: var(--accent); }
.src.changed { color: var(--text); }
.src.changed i { background: var(--warn); }

@container (max-width: 640px) {
    .ctl, .ctl.flat { grid-template-columns: minmax(0, 1fr); }
}
</style>
