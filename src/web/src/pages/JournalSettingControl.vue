<script setup>
import {api} from "../api/client.js";
import Switch from "../kit/Switch.vue";
import SwitchCase from "../kit/SwitchCase.vue";
import Section from "./Section.vue";

defineProps({row: {type: Object, required: true}, extension: {type: Object, default: null}});
const emit = defineEmits(["save-color"]);
</script>

<template>
    <SwitchCase :value="row.kind">
        <template #switch>
            <Switch :on="row.on" @change="row.set" />
        </template>
        <template #color>
            <Section @save-color="(color) => emit('save-color', color)" />
        </template>
        <template #extension>
            <template v-if="extension && extension.available">
                <template v-if="extension.store">
                    <a class="settings-link" :href="extension.store" target="_blank" rel="noopener">Add to Chrome</a>
                </template>
                <a class="settings-link" :href="api.extensionZip()">Download</a>
            </template>
        </template>
    </SwitchCase>
</template>

<style scoped>
.settings-link {
    color: var(--accent-text);
    font-size: 12.5px;
    white-space: nowrap;
}

.settings-link:hover {
    color: var(--text);
}
</style>
