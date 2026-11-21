<script setup lang="ts">
import type { RequestWindowData } from '@generated/types/processes';

defineProps<{ data: RequestWindowData }>();
</script>

<template>
    <section aria-label="Where the request stands">
        <p>
            <code>{{ data.request.line }}</code>
        </p>
        <p>
            {{ data.request.state }}: waiting because
            {{ data.request.holdReason }}
        </p>
        <template v-if="data.steps.length > 0">
            <p>Still to do: {{ data.steps.join('; ') }}</p>
        </template>
        <p>
            Next: <code>{{ data.request.next }}</code>
        </p>
        <p>
            Rule in use:
            {{
                data.activeRevision === 0
                    ? 'none yet'
                    : `revision ${data.activeRevision}`
            }}
        </p>
    </section>
</template>
