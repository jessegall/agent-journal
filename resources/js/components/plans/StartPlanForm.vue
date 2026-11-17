<script setup lang="ts">
import { useForm } from '@inertiajs/vue3';
import Button from '@/components/kit/Button.vue';
import FormErrors from '@/components/kit/FormErrors.vue';
import { start as startRoute } from '@/routes/plans';
import type {
    PlanFiltersData,
    StartPlanData,
    StartPlanInput,
} from '@/types/generated';

/**
 * Starts the selected plan. The server decides whether it may start; this form only asks and shows what came back.
 * Its parent keys it by plan, so switching selection never shows another plan's error.
 */
const props = defineProps<{ start: StartPlanData; filters: PlanFiltersData }>();

const form = useForm<StartPlanInput>({ filters: props.filters });

function submit(): void {
    form.transform(() => ({ filters: props.filters })).submit(
        startRoute({ plan: Number(props.start.planId) }),
        {
            preserveScroll: true,
        },
    );
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
