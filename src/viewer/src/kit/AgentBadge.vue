<script setup>
import {computed} from "vue";
import Icon from "./Icon.vue";
import {agentLabel} from "../domain/agentLabel.js";

// the one badge for an agent: its icon and its name, and a main agent reads "main agent" in purple wherever it shows
const props = defineProps({name: {type: String, required: true}, main: Boolean, iconOnly: Boolean});
const label = computed(() => agentLabel(props.name, props.main));
</script>

<template>
    <span :class="['agent-badge', {main}]" data-agent-badge :data-agent-main="main ? '' : null">
        <template v-if="main">
            <svg class="agent-badge-icon" data-agent-main-icon width="14" height="14" viewBox="0 0 16 16" fill="currentColor" aria-hidden="true"><circle cx="8" cy="4.8" r="3.3" /><path d="M1.8 14.6c0-3.4 2.8-5.6 6.2-5.6s6.2 2.2 6.2 5.6c0 .4-.3.7-.7.7H2.5c-.4 0-.7-.3-.7-.7z" /></svg>
        </template>
        <template v-else>
            <Icon class="agent-badge-icon" name="agent" :size="14" />
        </template>
        <template v-if="!iconOnly">
            <span class="agent-badge-name" data-agent-badge-name>{{ label }}</span>
        </template>
    </span>
</template>

<style scoped>
.agent-badge {
    display: inline-flex;
    gap: 5px;
    align-items: center;
    min-width: 0;
    color: inherit;
}

.agent-badge.main {
    color: var(--tone-sequence);
}

.agent-badge-icon {
    flex: none;
}

.agent-badge-name {
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
}
</style>
