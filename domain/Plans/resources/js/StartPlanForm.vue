<script setup lang="ts">
import { useForm } from '@inertiajs/vue3';
import Button from '@kit/Button';
import FormErrors from '@kit/FormErrors';
import { formSendingHooks } from '@kit/usePageChanges';
import { start as startRoute } from '@generated/routes/plans';
import type { StartPlanData } from '@generated/types/plans';

/**
 * Starts the selected plan. The server decides whether it may start; this form only asks and shows what came back.
 * Its parent keys it by plan, so switching selection never shows another plan's error.
 */
const props = defineProps<{ start: StartPlanData }>();

const form = useForm({});

function submit(): void {
    form.submit(startRoute({ plan: props.start.planNumber }), {
        preserveScroll: true,
        ...formSendingHooks(),
    });
}
</script>

<template>
    <form class="flex flex-col items-end gap-2" @submit.prevent="submit">
        <Button type="submit" variant="primary" :pending="form.processing"
            >Start plan</Button
        >
        <FormErrors :errors="form.errors" />
    </form>
</template>
