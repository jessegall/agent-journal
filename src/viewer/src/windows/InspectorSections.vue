<script setup>
import {computed, inject} from "vue";
import {INSPECTOR_HOST} from "./windowContext.js";
import WindowPane from "./WindowPane.vue";

// the sections modules add to an inspector: each is a window, drawn by WindowPane, so its trust, allowance and failure are handled as for any window
const props = defineProps({slotName: {type: String, required: true}, row: {type: Object, required: true}});
const host = inject(INSPECTOR_HOST, null);
const sections = computed(() => host?.catalogue.sectionsAt(props.slotName) ?? []);
const options = computed(() => ({row: props.row}));
</script>

<template>
    <template v-for="section in sections" :key="section.name">
        <div class="inspector-section" :data-section="section.name">
            <WindowPane
                :name="section.name"
                :catalogue="host.catalogue"
                :subscriptions="host.subscriptions"
                :environment="host.environment"
                :prompts="host.prompts"
                :shell-read="host.shellRead"
                :options="options"
            />
        </div>
    </template>
</template>
