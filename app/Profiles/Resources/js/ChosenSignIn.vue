<script setup lang="ts">
import type { SignInMethodData } from '@generated/types/accounts';
import ProgramIcon from '@kit/ProgramIcon';
import { programIcon, programName } from './accountLooks';

/**
 * The line at the top of every step after the first: the chosen program and method, and what it bills.
 */
defineProps<{ program: string; method: SignInMethodData }>();
</script>

<template>
    <div
        class="flex items-center gap-2 border-b border-line pb-4 text-small text-text-3"
    >
        <ProgramIcon
            :program="programIcon(program)"
            :size="16"
            class="mr-0.5"
        />
        {{ programName(program) }} ·
        <b class="font-medium text-text">{{ method.cardTitle }}</b>
        <span class="ml-auto whitespace-nowrap">{{ method.billingWord }}</span>
    </div>
</template>
