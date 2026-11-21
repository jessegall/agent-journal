<script setup lang="ts">
import type { ReleaseOfferData } from '@generated/types/connections';
import { size } from '@kit/format';

/**
 * Beside Copy, what the current release installs: each supported platform with its measured size and what the
 * machine needs first, each platform not offered with why, and the capabilities the release still lacks.
 */
defineProps<{ release: ReleaseOfferData }>();
</script>

<template>
    <ul class="flex flex-col gap-1 text-small text-muted">
        <template v-for="target in release.targets" :key="target.name">
            <template v-if="target.isSupported">
                <li>
                    {{ target.name }}: {{ size(target.bytes) }} to download and
                    install. Needs {{ target.prerequisites.join(', ') }}.
                </li>
            </template>
            <template v-else-if="!target.isMeasured">
                <li>
                    {{ target.name }} is not offered yet: its size was not
                    measured.
                </li>
            </template>
            <template v-else>
                <li>
                    {{ target.name }} is not offered yet, because it does not
                    run {{ target.missingProviders.join(' or ') }}.
                </li>
            </template>
        </template>
        <template v-if="release.missingCapabilities.length > 0">
            <li>
                This release cannot do
                {{ release.missingCapabilities.join(', ') }} yet.
            </li>
        </template>
    </ul>
</template>
