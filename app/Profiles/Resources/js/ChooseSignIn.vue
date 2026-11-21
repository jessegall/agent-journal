<script setup lang="ts">
import type {
    ProgramMethodsData,
    SignInMethod,
} from '@generated/types/accounts';
import OptionCards from '@kit/OptionCards';
import ProgramIcon from '@kit/ProgramIcon';
import SegmentedSwitch from '@kit/SegmentedSwitch';
import { computed } from 'vue';
import { programIcon, programName } from './accountLooks';

/**
 * The wizard's first step: the program switch, then a card for each way that program signs in on this host, each
 * saying how it works and what it bills. Enter or a double click on a card moves on.
 */
const props = defineProps<{ methods: ProgramMethodsData[] }>();

const program = defineModel<string>('program', { required: true });
const method = defineModel<SignInMethod | null>('method', { required: true });

const emit = defineEmits<{ confirm: [] }>();

const programs = computed(() =>
    props.methods.map((entry) => ({
        value: entry.program,
        label: programName(entry.program),
    })),
);

const cards = computed(() =>
    (
        props.methods.find((entry) => entry.program === program.value)
            ?.methods ?? []
    ).map((option) => ({
        value: option.method,
        title: option.title,
        aside: option.billingLabel,
        description: option.description,
    })),
);

function chooseProgram(chosen: string): void {
    program.value = chosen;
    method.value = null;
}
</script>

<template>
    <SegmentedSwitch
        label="Program"
        :options="programs"
        :model-value="program"
        @update:model-value="chooseProgram"
    >
        <template #icon="{ value }">
            <ProgramIcon :program="programIcon(value)" :size="14" />
        </template>
    </SegmentedSwitch>
    <OptionCards
        v-model="method"
        label="How to sign in"
        :options="cards"
        @confirm="emit('confirm')"
    >
        <template #icon>
            <ProgramIcon :program="programIcon(program)" :size="18" />
        </template>
    </OptionCards>
    <template v-if="method === null">
        <div class="flex-1" />
        <p class="text-meta leading-normal text-text-3">
            Choose a way to sign in to continue.
        </p>
    </template>
</template>
