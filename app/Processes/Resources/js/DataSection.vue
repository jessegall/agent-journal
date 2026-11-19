<script setup lang="ts">
import type { RequestWindowData } from '@generated/types/processes';

defineProps<{ data: RequestWindowData }>();
</script>

<template>
    <section aria-label="Where the request stands">
        <p><code>{{ data.request.line }}</code></p>
        <p>State: {{ data.request.state }} (held because {{ data.request.holdReason }})</p>
        <template v-if="data.steps.length > 0">
            <p>Still required: {{ data.steps.join('; ') }}</p>
        </template>
        <p>Next: <code>{{ data.request.next }}</code></p>
        <p>Active revision of this rule: {{ data.activeRevision === 0 ? 'none' : data.activeRevision }}</p>
    </section>
</template>
