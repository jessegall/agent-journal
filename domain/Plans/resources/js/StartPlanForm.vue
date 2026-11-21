<script setup lang="ts">
import { useForm } from '@inertiajs/vue3';
import Button from '@kit/Button';
import FormErrors from '@kit/FormErrors';
import { formSendingHooks } from '@kit/usePageChanges';
import { start as startRoute } from '@generated/routes/plans';
import type { StartPlanData } from '@generated/types/plans';

/**
 * Starts a plan the server offers to start; this form only asks and shows what came back. Its parent keys it by plan,
 * so switching plans never shows another plan's error. A parent may give its own submit control, such as a menu item.
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
    <form class="flex flex-col gap-2" @submit.prevent="submit">
        <slot :pending="form.processing">
            <Button type="submit" variant="primary" :pending="form.processing"
                >Start plan</Button
            >
        </slot>
        <FormErrors :errors="form.errors" />
    </form>
</template>
