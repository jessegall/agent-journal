<script setup lang="ts">
import type { SignInMethodData } from '@generated/types/accounts';
import DriverIcon from '@kit/DriverIcon';
import { driverIcon, driverName } from './accountLooks';

/**
 * The line at the top of every step after the first: the chosen driver and method, and what it bills.
 */
defineProps<{ driver: string; method: SignInMethodData }>();
</script>

<template>
    <div
        class="flex items-center gap-2 border-b border-line pb-4 text-small text-text-3"
    >
        <DriverIcon :driver="driverIcon(driver)" :size="16" class="mr-0.5" />
        {{ driverName(driver) }} ·
        <b class="font-medium text-text">{{ method.title }}</b>
        <span class="ml-auto whitespace-nowrap">{{ method.billingLabel }}</span>
    </div>
</template>
