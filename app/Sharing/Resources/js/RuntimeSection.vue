<script setup lang="ts">
import type { ShareDetailData } from '@generated/types/sharing';

/**
 * The state of the gateway serving a share: offline, without an endpoint, or its endpoint's last health.
 */

defineProps<{ runtime: ShareDetailData['runtime'] }>();
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
                Endpoint version {{ runtime.endpointVersion }}, last healthy
                {{ runtime.lastHealthAt ?? 'never' }}:
                {{
                    runtime.isHealthy
                        ? 'healthy'
                        : 'stale (no health report in the last 45 seconds)'
                }}.
            </p>
        </template>
    </section>
</template>
