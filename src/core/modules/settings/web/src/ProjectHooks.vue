<script setup>
import {onMounted} from "vue";
import {WindowRoom, useReadLine} from "@journal/window-kit";

const {value, failure, load} = useReadLine(() => "managed-hook list");
onMounted(load);
</script>

<template>
    <WindowRoom>
        <p v-if="failure" role="alert">{{ failure }}</p>
        <p v-if="value">Managed: {{ value.managed.length }} · Pending: {{ value.pending.length }}</p>
    </WindowRoom>
</template>
