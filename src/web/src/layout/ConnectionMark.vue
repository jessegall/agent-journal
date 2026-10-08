<script setup>
import {computed, watch} from "vue";
import Chip from "../kit/Chip.vue";
import {connection, loadConnection} from "../composables/connection.js";
import {connectionOn} from "../composables/settings.js";
import {markerTone, markerWords} from "../domain/connection.js";
import {ago} from "../format/time.js";

const words = computed(() => (connectionOn.value && connection.value ? markerWords(connection.value, ago) : ""));

watch(connectionOn, (on) => on && loadConnection(), {immediate: true});
</script>

<template>
    <template v-if="words">
        <Chip class="connection-mark" :tone="markerTone(connection)" :title="'Which journal this is, and how it stands with the other one'">{{ words }}</Chip>
    </template>
</template>
