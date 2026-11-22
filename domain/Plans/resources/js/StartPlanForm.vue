<script setup lang="ts">
import { router, useForm } from '@inertiajs/vue3';
import { ref } from 'vue';
import Button from '@kit/Button';
import FormErrors from '@kit/FormErrors';
import { useHostProp } from '@/framework/hostProp';
import { formSendingHooks } from '@kit/usePageChanges';
import { start as startRoute } from '@generated/routes/plans';
import type { StartPlanData } from '@generated/types/plans';

/**
 * Starts a plan the server offers to start; this form only asks and shows what came back. It sends one start at a
 * time and reloads only the prop of the window or section it is drawn in. When no answer comes the outcome is
 * unknown: it never sends again by itself and offers Check plan, which reads the plan anew; a repeat of a start that
 * landed changes nothing.
 * Its parent keys it by plan, so switching plans never shows another plan's error. A parent may give its own
 * controls, such as menu items, through the default and unknown slots.
 */
const props = defineProps<{ start: StartPlanData }>();

const refresh = [useHostProp()];
const form = useForm({});
const isOutcomeUnknown = ref(false);

function markUnknown(): boolean {
    isOutcomeUnknown.value = true;

    return false;
}

function submit(): void {
    if (form.processing) {
        return;
    }

    form.submit(startRoute({ plan: props.start.planNumber }), {
        ...formSendingHooks(),
        only: refresh,
        preserveState: true,
        preserveScroll: true,
        onHttpException: markUnknown,
        onNetworkError: markUnknown,
    });
}

function checkPlan(): void {
    router.reload({
        only: refresh,
        onSuccess: () => {
            isOutcomeUnknown.value = false;
        },
    });
}
</script>

<template>
    <form class="flex flex-col gap-2" @submit.prevent="submit">
        <template v-if="isOutcomeUnknown">
            <slot name="unknown" :check="checkPlan">
                <p role="status" class="text-small text-text-2">
                    Outcome unknown. Check the plan to see whether it started.
                </p>
                <Button type="button" variant="bordered" @click="checkPlan"
                    >Check plan</Button
                >
            </slot>
        </template>
        <template v-else>
            <slot :pending="form.processing">
                <Button
                    type="submit"
                    variant="primary"
                    :pending="form.processing"
                    >Start plan</Button
                >
            </slot>
        </template>
        <FormErrors :errors="form.errors" />
    </form>
</template>
