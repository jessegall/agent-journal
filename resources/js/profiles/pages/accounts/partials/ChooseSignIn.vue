<script setup lang="ts">
import { useAppContext } from '@kit/appContext';
import type {
    DriverMethodsData,
    SignInMethod,
} from '@generated/types/accounts';
import OptionCards from '@kit/OptionCards';
import DriverIcon from '@kit/DriverIcon';
import SegmentedControl from '@kit/SegmentedControl';
import { computed } from 'vue';

const { driverLabel } = useAppContext();

/**
 * The wizard's first step: the driver switch, then a card for each way that driver signs in on this host, each
 * saying how it works and how it is billed. Enter or a double click on a card moves on.
 */
const props = defineProps<{ methods: DriverMethodsData[] }>();

const driver = defineModel<string>('driver', { required: true });
const method = defineModel<SignInMethod | null>('method', { required: true });

const emit = defineEmits<{ confirm: [] }>();

const drivers = computed(() =>
    props.methods.map((entry) => ({
        value: entry.driver,
        label: driverLabel(entry.driver),
    })),
);

const cards = computed(() =>
    (
        props.methods.find((entry) => entry.driver === driver.value)?.methods ??
        []
    ).map((option) => ({
        value: option.method,
        title: option.title,
        aside: option.billingLabel,
        description: `${option.description} ${option.billingNote}`,
    })),
);

function chooseDriver(chosen: string): void {
    driver.value = chosen;
    method.value = null;
}
</script>

<template>
    <SegmentedControl
        label="Driver"
        :items="drivers"
        :model-value="driver"
        @update:model-value="chooseDriver"
    >
        <template #icon="{ value }">
            <DriverIcon :driver="value" :size="14" />
        </template>
    </SegmentedControl>
    <OptionCards
        v-model="method"
        label="How to sign in"
        :options="cards"
        @confirm="emit('confirm')"
    >
        <template #icon>
            <DriverIcon :driver="driver" :size="18" />
        </template>
    </OptionCards>
    <template v-if="method === null">
        <div class="flex-1" />
        <p class="text-meta leading-normal text-text-3">
            Choose a way to sign in to continue.
        </p>
    </template>
</template>
