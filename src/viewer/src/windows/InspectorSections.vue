<script setup>
import {computed, inject} from "vue";
import {INSPECTOR_HOST} from "./windowContext.js";
import WindowPane from "./WindowPane.vue";

// the sections of an inspector: first the windows its declaration names, in order, then the sections other modules add at its slot; each is a window,
// drawn by WindowPane, so its trust, allowance and failure are handled as for any window, and a named window that is not offered is told in one line
const props = defineProps({slotName: {type: String, default: ""}, names: {type: Array, default: () => []}, row: {type: Object, required: true}});
const host = inject(INSPECTOR_HOST, null);
const sections = computed(() => {
    const declared = props.names.map((name) => ({name, offered: Boolean(host?.catalogue.window(name))}));
    const added = (props.slotName ? host?.catalogue.sectionsAt(props.slotName) ?? [] : []).filter((section) => !props.names.includes(section.name));
    return [...declared, ...added.map((section) => ({name: section.name, offered: true}))];
});
const options = computed(() => ({row: props.row}));
</script>

<template>
    <template v-if="host">
        <template v-for="section in sections" :key="section.name">
            <div class="inspector-section" :data-section="section.name">
                <template v-if="section.offered">
                    <WindowPane
                        :name="section.name"
                        :catalogue="host.catalogue"
                        :subscriptions="host.subscriptions"
                        :environment="host.environment"
                        :prompts="host.prompts"
                        :shell-read="host.shellRead"
                        :options="options"
                    />
                </template>
                <template v-else>
                    <p class="inspector-section-missing" data-section-missing>{{ section.name }} is not available</p>
                </template>
            </div>
        </template>
    </template>
</template>

<style scoped>
.inspector-section-missing {
    margin: 0;
    color: var(--text-3);
    font-size: 12px;
}
</style>
