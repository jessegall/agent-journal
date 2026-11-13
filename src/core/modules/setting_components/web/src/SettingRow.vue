<script setup>
import {computed} from "vue";
import {CHANGED_WORD, SOURCE_WORDS} from "./sourceWords.js";

// one setting: its name and what it does, the control that changes it in the slot, where its value comes from or
// that it is changed, and the line that says what is wrong with it
const props = defineProps({
    label: {type: String, required: true},
    help: {type: String, default: ""},
    source: {type: String, default: ""},
    changed: {type: Boolean, default: false},
    error: {type: String, default: ""},
    found: {type: Boolean, default: false},
    wide: {type: Boolean, default: false},
});
const sourceText = computed(() => (props.changed ? CHANGED_WORD : SOURCE_WORDS[props.source] ?? ""));
const showsSource = computed(() => props.changed || Boolean(props.source));
</script>

<template>
    <div :class="['setting-row', {flat: !showsSource, found, wide}]">
        <div class="text">
            <span class="lab">
                {{ label }}
                <template v-if="changed">
                    <i class="dot" data-setting-changed title="Changed, not applied" />
                </template>
            </span>
            <template v-if="help">
                <span class="help">{{ help }}</span>
            </template>
        </div>
        <div class="control"><slot /></div>
        <template v-if="showsSource">
            <div :class="['src', {set: source && source !== 'default', ch: changed}]" data-setting-source>{{ sourceText }}</div>
        </template>
        <template v-if="error">
            <div class="err" role="alert" data-setting-error>{{ error }}</div>
        </template>
    </div>
</template>

<style scoped>
.setting-row { display: grid; grid-template-columns: minmax(0, 1fr) 230px 140px; gap: 6px 18px; align-items: center; padding: 11px 0; border-top: 1px solid var(--border); }
.setting-row.flat { grid-template-columns: minmax(0, 1fr) 230px; }
.setting-row.found { background: var(--accent-dim); box-shadow: 0 0 0 6px var(--accent-dim); border-radius: 6px; }
.setting-row.wide { grid-template-columns: minmax(0, 1fr) 140px; }
.setting-row.wide.flat { grid-template-columns: minmax(0, 1fr); }
.setting-row.wide .control { grid-column: 1 / -1; grid-row: 2; }
.setting-row.wide .src { grid-column: 2; grid-row: 1; }
.text { min-width: 0; }
.lab { display: flex; align-items: center; gap: 7px; color: var(--text); font-size: 12.8px; }
.dot { width: 6px; height: 6px; border-radius: 50%; background: var(--accent); flex: none; }
.help { display: block; margin-top: 3px; color: var(--text-3); font-size: 12px; line-height: 1.45; text-wrap: pretty; }
.control { display: flex; flex-wrap: wrap; align-items: center; gap: 8px; min-width: 0; }
.src { color: var(--text-3); font-size: 11.5px; text-align: right; }
.src.set { color: var(--text-2); }
.src.ch { color: var(--accent-text); }
.err { grid-column: 1 / -1; color: var(--danger); font-size: 12px; }

@container (max-width: 640px) {
    .setting-row, .setting-row.flat { grid-template-columns: minmax(0, 1fr); }
    .src { text-align: left; }
    .setting-row.wide .control, .setting-row.wide .src { grid-column: 1; grid-row: auto; }
}
</style>
