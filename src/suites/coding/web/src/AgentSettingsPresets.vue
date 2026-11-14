<script setup>
import {SettingPresetCard, SettingPresetCompareTable} from "@journal/setting-components";

// the page that says what a preset is: a set of the eight switches and nothing more, with each preset in short, the
// presets side by side with the form as it is now, and a way to fill the form with one
defineProps({presets: {type: Array, required: true}, switches: {type: Array, required: true}, now: {type: Object, required: true}, readOnly: {type: Boolean, default: false}});
const emit = defineEmits(["back", "fill"]);

const CUSTOM_LINE = "Any other mix of the eight switches. The form shows Custom as soon as the switches match neither preset.";
</script>

<template>
    <section class="page" data-agent-settings-presets>
        <div class="crumb">
            <button type="button" class="back" data-presets-back @click="emit('back')">‹ Back</button>
            <b>What is a preset?</b>
        </div>
        <div class="body">
            <p class="lead">A preset is a set of eight switches and nothing more. It is not a type of agent: the main agent is the same program under every preset, and a preset only fills in the switches below. Nothing is saved until you press Save.</p>
            <div class="cards">
                <template v-for="preset in presets" :key="preset.key">
                    <SettingPresetCard :name="preset.name" :line="preset.line" :can-fill="!readOnly" @fill="emit('fill', preset.key)" />
                </template>
                <SettingPresetCard name="Custom" :line="CUSTOM_LINE" />
            </div>
            <SettingPresetCompareTable :rows="switches" :presets="presets" :now="now" />
        </div>
    </section>
</template>

<style scoped>
.page { display: flex; flex-direction: column; flex: 1; min-height: 0; overflow-y: auto; }
.crumb { display: flex; align-items: center; gap: 10px; height: 42px; padding: 0 22px; border-bottom: 1px solid var(--border); color: var(--text); font-size: 12.5px; flex: none; }
.back { padding: 0; border: 0; background: none; color: var(--accent-text); font: inherit; cursor: pointer; }
.body { padding: 14px 28px 24px; }
.lead { max-width: 680px; margin: 0 0 14px; color: var(--text-2); font-size: 13px; line-height: 1.55; text-wrap: pretty; }
.cards { display: grid; gap: 10px; margin-bottom: 18px; }
</style>
