<script setup>
import {onMounted} from "vue";
import {WindowRoom, useReadLine} from "@journal/window-kit";

const {value, failure, load} = useReadLine(() => "managed-hook list");
onMounted(load);
</script>

<template>
    <WindowRoom>
        <template v-if="failure">
            <p role="alert">{{ failure }}</p>
        </template>
        <template v-if="value">
            <p>Managed: {{ value.managed.length }} · Pending: {{ value.pending.length }}</p>
        </template>
    </WindowRoom>
</template>
