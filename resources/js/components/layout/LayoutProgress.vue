<script setup lang="ts">
import { computed } from 'vue';
import CountedProgress from '@/components/kit/CountedProgress.vue';
import Meter from '@/components/kit/Meter.vue';
import UsageMeter from '@/components/kit/UsageMeter.vue';
import SwitchCase from '@/components/kit/SwitchCase.vue';
import type { LayoutPartData } from '@/generated/types/core';

// A measured reading of a declared layout: a counted progress when it counts pieces, otherwise a fluid meter that
// reads its value, maximum and label aloud, with the number and its unit kept beside the bar. A share of pieces finished is a short meter with its percent beside it. An allowance in use is
// the kit's UsageMeter: in a list row the meter alone with the readings of every window as its tip, in a reader the
// meter with its percent used beside it.
const props = defineProps<{ part: LayoutPartData }>();
const progress = computed(() => props.part.progress);
const share = computed(() =>
    progress.value === undefined || progress.value.max === 0
        ? 0
        : Math.round((progress.value.value / progress.value.max) * 100),
);
const words = computed(() =>
    progress.value === undefined ? '' : `${progress.value.value} of ${progress.value.max} ${progress.value.unit}`,
);
</script>

<template>
    <template v-if="progress !== undefined">
        <SwitchCase :value="part.style">
            <template #counted>
                <CountedProgress
                    :owner="progress.label"
                    :finished="progress.value"
                    :total="progress.max"
                    :text="words"
                />
            </template>
            <template #share>
                <span class="flex items-center gap-2">
                    <Meter
                        :value="progress.value"
                        :max="progress.max"
                        :unit="progress.unit"
                        :label="progress.label"
                    />
                    <span class="w-8 text-right text-small text-text-3 tabular-nums">{{ share }}%</span>
                </span>
            </template>
            <template #usage-row>
                <UsageMeter variant="row" :value="progress.value" :tip="part.detail ?? ''" />
            </template>
            <template #usage>
                <span class="flex items-center gap-2.5">
                    <Meter fluid size="lg" :value="progress.value" :label="`${progress.value}% used`" />
                    <span
                        class="text-small tabular-nums"
                        :class="progress.value >= 90 ? 'font-medium text-text' : 'text-text-3'"
                        >{{ progress.value }}% used</span
                    >
                </span>
            </template>
            <template #default>
                <span class="flex items-center gap-2.5">
                    <Meter
                        fluid
                        size="lg"
                        :value="progress.value"
                        :max="progress.max"
                        :unit="progress.unit"
                        :label="progress.label"
                    />
                    <span class="text-small text-text-3 tabular-nums">{{ words }}</span>
                </span>
            </template>
        </SwitchCase>
    </template>
</template>
