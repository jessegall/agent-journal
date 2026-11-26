<script setup lang="ts">
import { router, useForm } from '@inertiajs/vue3';
import { ref } from 'vue';
import Button from '@kit/Button';
import FormErrors from '@kit/FormErrors';
import { useHostProp } from '@kit/hostProp';
import { formSendingHooks } from '@kit/usePageChanges';
import { start as startRoute } from '@generated/routes/plans';
import type { StartPlanData } from '@generated/types/plans';

/**
 * Starts a plan the server offers to start, one start at a time, reloading only its window's prop. When no answer comes
 * it never sends again by itself and offers Check plan; its parent keys it by plan and may add controls through the
 * default and unknown slots.
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
