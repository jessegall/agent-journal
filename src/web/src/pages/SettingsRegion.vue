<script setup>
import SettingGroup from "../kit/SettingGroup.vue";
import AgentVoice from "./AgentVoice.vue";
import SettingsTunnel from "./SettingsTunnel.vue";

defineProps({region: {type: Object, required: true}, across: Boolean, sheet: Boolean});
defineEmits(["change", "timing", "act"]);
</script>

<template>
    <div class="settings-region" :data-tab="region.key">
        <div class="settings-region-head">
            <template v-if="across">
                <h2 class="settings-in">In {{ region.title }}</h2>
            </template>
            <p class="settings-line">{{ region.line }}</p>
        </div>
        <template v-for="group in region.groups" :key="group.key">
            <SettingGroup
                :group="group"
                :sheet="sheet"
                @change="(row, value) => $emit('change', row, value)"
                @timing="(row, next) => $emit('timing', row, next)"
                @act="(row, key) => $emit('act', row, key)"
            >
                <template v-if="group.key === 'voice'" #before>
                    <AgentVoice />
                </template>
            </SettingGroup>
        </template>
        <template v-if="region.key === 'sharing' && !across">
            <div class="settings-region-head">
                <h3 class="settings-subhead">Tunler account</h3>
                <p class="settings-line">Tunler is the service that gives share links and phones their web address. Connect an account here.</p>
            </div>
            <SettingsTunnel />
        </template>
    </div>
</template>

<style scoped>
.settings-region {
    display: flex;
    flex-direction: column;
    gap: 30px;
}

.settings-region-head {
    display: flex;
    flex-direction: column;
    gap: 6px;
}

.settings-line {
    margin: 0;
    color: var(--text-2);
    font-size: 13px;
}

.settings-in {
    margin: 0;
    color: var(--text-3);
    font-size: 11px;
    font-weight: 600;
    letter-spacing: 0.06em;
    text-transform: uppercase;
}

.settings-subhead {
    margin: 0;
    color: var(--text);
    font-size: 15px;
    font-weight: 600;
    letter-spacing: -0.005em;
}
</style>
