<script setup lang="ts">
import type {
    DriverMethodsData,
    SignInMethod,
} from '@generated/types/accounts';
import OptionCards from '@kit/OptionCards';
import DriverIcon from '@kit/DriverIcon';
import SegmentedSwitch from '@kit/SegmentedSwitch';
import { computed } from 'vue';
import { driverIcon, driverName } from './accountLooks';

/**
 * The wizard's first step: the driver switch, then a card for each way that driver signs in on this host, each
 * saying how it works and what it bills. Enter or a double click on a card moves on.
 */
const props = defineProps<{ methods: DriverMethodsData[] }>();

const driver = defineModel<string>('driver', { required: true });
const method = defineModel<SignInMethod | null>('method', { required: true });

const emit = defineEmits<{ confirm: [] }>();

const drivers = computed(() =>
    props.methods.map((entry) => ({
        value: entry.driver,
        label: driverName(entry.driver),
    })),
);

const cards = computed(() =>
    (
        props.methods.find((entry) => entry.driver === driver.value)
            ?.methods ?? []
    ).map((option) => ({
        value: option.method,
        title: option.title,
        aside: option.billingLabel,
        description: option.description,
    })),
);

function chooseDriver(chosen: string): void {
    driver.value = chosen;
    method.value = null;
}
</script>

<template>
    <SegmentedSwitch
        label="Driver"
        :options="drivers"
        :model-value="driver"
        @update:model-value="chooseDriver"
    >
        <template #icon="{ value }">
            <DriverIcon :driver="driverIcon(value)" :size="14" />
        </template>
    </SegmentedSwitch>
    <OptionCards
        v-model="method"
        label="How to sign in"
        :options="cards"
        @confirm="emit('confirm')"
    >
        <template #icon>
            <DriverIcon :driver="driverIcon(driver)" :size="18" />
        </template>
    </OptionCards>
    <template v-if="method === null">
        <div class="flex-1" />
        <p class="text-meta leading-normal text-text-3">
            Choose a way to sign in to continue.
        </p>
    </template>
</template>
