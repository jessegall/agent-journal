<script setup>
import {Btn, Dialog} from "@journal/window-kit";

// what an upgrade of a plugin changes, shown before it goes ahead
defineProps({upgrade: {type: Object, required: true}});
const emit = defineEmits(["close", "apply"]);
</script>

<template>
    <Dialog padded :title="`Upgrade ${upgrade.name}`" @close="emit('close')">
        <div data-plugin-upgrade-body>
            <p class="plugin-note">{{ upgrade.installed }} to {{ upgrade.version }}. Services that run keep the old code until the journal restarts.</p>
            <template v-if="!upgrade.changes.length">
                <p class="plugin-note">It runs the same commands as the version you have.</p>
            </template>
            <template v-for="change in upgrade.changes" :key="change">
                <p class="plugin-output" data-plugin-upgrade-change>{{ change }}</p>
            </template>
        </div>
        <template #foot>
            <Btn @click="emit('close')">Cancel</Btn>
            <Btn variant="primary" data-plugin-upgrade-apply @click="emit('apply')">Upgrade</Btn>
        </template>
    </Dialog>
</template>

<style scoped>
.plugin-output {
    margin: 0 0 6px;
    font-size: 13px;
    white-space: pre-wrap;
}

.plugin-note {
    margin: 0;
    color: var(--text-3);
    font-size: 12px;
}
</style>
