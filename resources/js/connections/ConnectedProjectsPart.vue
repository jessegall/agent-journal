<script setup lang="ts">
import type { ConnectProjectWindowData } from '@generated/types/connections';
import ConnectProjectWindow from './ConnectProjectWindow.vue';

/**
 * The Connected projects section of Settings: the connect line with its token, the waiting attempts and each connected
 * folder with its state and Revoke, the same as the Connect a project window shows, drawn inside the section.
 */
defineProps<{ data: ConnectProjectWindowData }>();
</script>

<template>
    <ConnectProjectWindow :data="data" embedded />
</template>
