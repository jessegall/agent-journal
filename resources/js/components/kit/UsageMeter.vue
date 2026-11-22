<script setup lang="ts">
import Meter from './Meter.vue';
import SegmentedControl from './SegmentedControl.vue';
import SettingRow from './SettingRow.vue';
import SwitchCase from './SwitchCase.vue';
import Tooltip from './Tooltip.vue';

/**
 * How much of an allowance is used, in three forms. Row: a md Meter 84 wide with both numbers in its Tooltip, or the
 * amount left in --text-2 for a key with no windows. Group: a SettingRow per window with "Resets …" and a lg Meter 220
 * with "n% used", which turns --text at 500 from 90%. Spend: "Left to spend" with the amount in bold, and "Spent" with
 * a SegmentedControl of periods and a sentence. Each form reads only the props named for it. A row with no reading says
 * Usage unavailable instead of falling back to zero; a measured zero is drawn with its unit.
 */
defineProps<{
    variant: 'row' | 'group' | 'spend';
    value?: number;
    tip?: string;
    amountLeft?: string;
    windows?: { title: string; resets: string; value: number }[];
    left?: string;
    periods?: { value: string; label: string }[];
    sentence?: string;
}>();

const period = defineModel<string>('period', { default: '' });
</script>

<template>
    <SwitchCase :value="variant">
        <template #row>
            <span v-if="amountLeft" class="text-small text-text-2 tabular-nums">{{ amountLeft }}</span>
            <span v-else-if="value === undefined" class="text-small text-text-3">Usage unavailable</span>
            <Tooltip v-else :text="tip ?? ''">
                <template #default="{ describedBy }">
                    <Meter :aria-describedby="describedBy" size="md" :width="84" :value="value" :label="`${value}% used`" />
                </template>
            </Tooltip>
        </template>
        <template #group>
            <SettingRow v-for="window in windows" :key="window.title" :title="window.title" :hint="`Resets ${window.resets}`">
                <span class="flex items-center gap-2.5">
                    <Meter size="lg" fluid :value="window.value" :label="`${window.value}% used`" />
                    <span
                        class="text-small tabular-nums"
                        :class="window.value >= 90 ? 'font-medium text-text' : 'text-text-3'"
                        >{{ window.value }}% used</span
                    >
                </span>
            </SettingRow>
        </template>
        <template #spend>
            <SettingRow title="Left to spend">
                <strong class="font-medium text-text tabular-nums">{{ left }}</strong>
            </SettingRow>
            <SettingRow title="Spent" :hint="sentence">
                <SegmentedControl v-model="period" label="Period" :items="periods ?? []" />
            </SettingRow>
        </template>
    </SwitchCase>
</template>
