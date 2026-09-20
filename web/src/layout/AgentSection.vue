<script setup lang="ts">
import {age} from "../store.js";

defineProps<{agent: unknown}>();
</script>

<template>
    <template>
        {{ agent.provider }}{{ agent.model ? ` · ${agent.model}` : "" }} · context {{ Math.round(agent.context || 0) }}% ·
        {{ age(agent.at) }}
    </template>
</template>
