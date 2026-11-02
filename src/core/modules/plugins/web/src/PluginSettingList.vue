<script setup>
// the settings of one plugin, each saved when its field changes
defineProps({settings: {type: Array, required: true}});
const emit = defineEmits(["configure"]);
</script>

<template>
    <div class="plugin-settings" data-plugin-setting-list>
        <template v-if="!settings.length">
            <p class="plugin-note">This plugin has no settings</p>
        </template>
        <template v-for="setting in settings" :key="setting.key">
            <label class="plugin-setting">
                <span class="plugin-setting-title">{{ setting.title || setting.key }}</span>
                <input :value="setting.value" :data-plugin-setting="setting.key" @change="emit('configure', setting, $event.target.value)">
            </label>
        </template>
    </div>
</template>

<style scoped>
.plugin-settings {
    display: flex;
    flex-direction: column;
    gap: 8px;
    margin-top: 8px;
}

.plugin-setting {
    display: flex;
    flex-direction: column;
    gap: 2px;
}

.plugin-setting-title {
    color: var(--text-3);
    font-size: 12px;
}

.plugin-note {
    margin: 0;
    color: var(--text-3);
    font-size: 12px;
}
</style>
