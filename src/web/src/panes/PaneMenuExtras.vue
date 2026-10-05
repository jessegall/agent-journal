<script setup>
import Icon from "../kit/Icon.vue";
import MenuItem from "../kit/MenuItem.vue";
import PaneMenuLine from "./PaneMenuLine.vue";
import PaneMenuLink from "./PaneMenuLink.vue";

defineProps({
    all: {type: Object, default: null},
    schemes: {type: Array, required: true},
    levels: {type: Array, required: true},
    flushable: {type: Boolean, default: false},
    flush: {type: Boolean, default: false},
    chat: {type: Boolean, default: false},
    agents: {type: Boolean, default: false},
    hidden: {type: Array, required: true},
});
const emit = defineEmits(["pick", "open", "all"]);
</script>

<template>
    <PaneMenuLine />
    <template v-if="flushable">
        <MenuItem @click="emit('pick', 'flush', !flush)">
            <Icon :name="flush ? 'narrow' : 'wide'" :size="14" />
            {{ flush ? "Inset" : "Flush" }}
        </MenuItem>
    </template>
    <template v-if="levels.length">
        <PaneMenuLink icon="list" label="Verbosity" @click="emit('open', 'levels')" />
    </template>
    <template v-if="agents">
        <PaneMenuLink icon="eye" label="View" @click="emit('open', 'agentView')" />
    </template>
    <template v-if="chat">
        <PaneMenuLink
            icon="eye"
            label="Show in chat"
            :note="hidden.length ? `${hidden.length} hidden` : ''"
            @click="emit('open', 'visible')"
        />
    </template>
    <template v-if="schemes.length">
        <PaneMenuLink icon="palette" label="Colour scheme" @click="emit('open', 'schemes')" />
    </template>
    <template v-if="all">
        <MenuItem @click="emit('all')">
            <Icon name="open" :size="14" />
            {{ all.label }}
        </MenuItem>
    </template>
</template>
