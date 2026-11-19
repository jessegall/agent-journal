<script setup lang="ts">
import { nextTick, ref } from 'vue';
import Button from '@/components/kit/Button.vue';

/**
 * A destructive product action that asks once before it runs, such as removing a saved account: the first press
 * shows the question in place with Cancel focused, Escape or Cancel takes it back, and only the second button runs
 * it. It never stands in front of plan or agent work.
 */
withDefaults(
    defineProps<{
        label: string;
        question: string;
        confirmLabel: string;
        pending?: boolean;
    }>(),
    { pending: false },
);

const emit = defineEmits<{ confirm: [] }>();

const asking = ref(false);
const cancel = ref<InstanceType<typeof Button> | null>(null);

async function ask(): Promise<void> {
    asking.value = true;
    await nextTick();
    (cancel.value?.$el as HTMLElement | undefined)?.focus();
}

function takeBack(): void {
    asking.value = false;
}

function confirm(): void {
    asking.value = false;
    emit('confirm');
}
</script>

<template>
    <template v-if="!asking">
        <Button variant="danger" size="small" :pending="pending" @click="ask">{{
            label
        }}</Button>
    </template>
    <template v-else>
        <div
            role="alertdialog"
            :aria-label="question"
            class="flex items-center gap-2"
            @keydown.escape.prevent="takeBack"
        >
            <span class="text-small text-text-2">{{ question }}</span>
            <Button
                ref="cancel"
                variant="bordered"
                size="small"
                @click="takeBack"
                >Cancel</Button
            >
            <Button variant="danger" size="small" @click="confirm">{{
                confirmLabel
            }}</Button>
        </div>
    </template>
</template>
