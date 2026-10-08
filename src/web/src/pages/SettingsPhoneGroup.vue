<script setup>
import SettingGroup from "../kit/SettingGroup.vue";
import AgentVoice from "./AgentVoice.vue";
import SettingsConnection from "./SettingsConnection.vue";
import SettingsTunnel from "./SettingsTunnel.vue";

defineProps({group: {type: Object, default: null}, tab: {type: String, required: true}});
const emit = defineEmits(["change", "timing", "act"]);
</script>

<template>
    <div class="settings-phone-group">
        <template v-if="group">
            <SettingGroup
                sheet
                :group="group"
                @change="(row, value) => emit('change', row, value)"
                @timing="(row, next) => emit('timing', row, next)"
                @act="(row, key) => emit('act', row, key)"
            >
                <template v-if="group.key === 'voice'" #before>
                    <AgentVoice />
                </template>
            </SettingGroup>
        </template>
        <template v-if="tab === 'sharing'">
            <SettingsTunnel />
            <SettingsConnection />
        </template>
    </div>
</template>

<style scoped>
.settings-phone-group {
    display: flex;
    flex-direction: column;
    padding: 16px;
}
</style>
