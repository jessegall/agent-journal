<script setup lang="ts">
import type { ReleaseOfferData } from '@generated/types/connections';

/**
 * Beside Copy, what the current release installs: each supported platform with its measured size and what the
 * machine needs first, each withheld platform with why, and the capabilities the release still lacks.
 */
defineProps<{ release: ReleaseOfferData }>();

function megabytes(bytes: number): string {
    return `${(bytes / 1_000_000).toFixed(1)} MB`;
}
</script>

<template>
    <ul class="flex flex-col gap-1 text-small text-muted">
        <template v-for="target in release.targets" :key="target.name">
            <li v-if="target.isSupported">
                {{ target.name }}: {{ megabytes(target.bytes) }} to download
                and install. Needs {{ target.prerequisites.join(', ') }}.
            </li>
            <li v-else-if="!target.isMeasured">
                {{ target.name }} is withheld: its size was not measured.
            </li>
            <li v-else>
                {{ target.name }} is withheld: it does not run
                {{ target.withheldProviders.join(' or ') }} yet.
            </li>
        </template>
        <li v-if="release.withheldCapabilities.length > 0">
            This release cannot do {{ release.withheldCapabilities.join(', ') }}
            yet.
        </li>
    </ul>
</template>
