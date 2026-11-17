<script setup lang="ts">
import { useForm } from '@inertiajs/vue3';
import Button from '@/components/kit/Button.vue';
import FormErrors from '@/components/kit/FormErrors.vue';
import { formSendingHooks } from '@/composables/usePageChanges';
import { start as startRoute } from '@/routes/plans';
import type { StartPlanData } from '@/types/generated';

/**
 * Starts the selected plan. The server decides whether it may start; this form only asks and shows what came back.
 * Its parent keys it by plan, so switching selection never shows another plan's error.
 */
const props = defineProps<{ start: StartPlanData }>();

const form = useForm({});

function submit(): void {
    form.submit(startRoute({ plan: Number(props.start.planId) }), {
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
