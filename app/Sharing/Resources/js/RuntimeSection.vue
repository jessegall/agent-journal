<script setup lang="ts">
import type { ShareRuntimeData } from '@generated/types/sharing';

/**
 * The state of the gateway serving a share: offline, without an endpoint, or its endpoint's last health.
 */

const runtime = defineProps<ShareRuntimeData>();
</script>

<template>
    <section class="flex flex-col gap-1" aria-label="Gateway runtime">
        <template v-if="runtime.isOffline">
            <p role="status">Offline: start the sharing service.</p>
        </template>
        <template v-else-if="runtime.endpointVersion === null">
            <p>No endpoint is serving this share.</p>
        </template>
        <template v-else>
            <p>
                {{
                    runtime.isHealthy
                        ? 'Running'
                        : 'Not answering: no sign of life in the last 45 seconds'
                }}. Version {{ runtime.endpointVersion }}, last seen
                {{ runtime.lastHealthAt ?? 'never' }}.
            </p>
        </template>
    </section>
</template>
