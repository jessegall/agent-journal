<script setup lang="ts">
import Meter from './Meter.vue';
import SegmentedControl from './SegmentedControl.vue';
import SettingRow from './SettingRow.vue';
import SwitchCase from './SwitchCase.vue';
import Tooltip from './Tooltip.vue';

/**
 * How much of an allowance is used: a row's Meter with its numbers as a tip, a group of SettingRows with each window's
 * reset and meter, or the spend form with what is left and spent. A row with no reading says Usage unavailable, never
 * zero. Measures: docs/designs/kit-components.md.
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
            <template v-if="amountLeft">
                <span class="text-small text-text-2 tabular-nums">{{ amountLeft }}</span>
            </template>
            <template v-else-if="value === undefined">
                <span class="text-small text-text-3">Usage unavailable</span>
            </template>
            <template v-else>
                <Tooltip :text="tip ?? ''">
                    <template #default="{ describedBy }">
                        <Meter :aria-describedby="describedBy" size="md" :width="84" :value="value" :label="`${value}% used`" />
                    </template>
                </Tooltip>
            </template>
        </template>
        <template #group>
            <template v-for="window in windows" :key="window.title">
                <SettingRow :title="window.title" :hint="`Resets ${window.resets}`">
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
