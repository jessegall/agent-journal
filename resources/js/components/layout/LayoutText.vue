<script setup lang="ts">
import { computed } from 'vue';
import StateBadge from '@/components/kit/StateBadge.vue';
import SwitchCase from '@/components/kit/SwitchCase.vue';
import type { LayoutPartData } from '@/generated/types/core';
import { dateTime } from '@/kit/format';

// A line of text of a declared layout, drawn by its style.
const props = defineProps<{ part: LayoutPartData }>();

type BadgeTone = 'quiet' | 'good' | 'warn' | 'danger' | 'busy';

// The server admits only these tones on a badge, so the word is one of them.
const badgeTone = computed(() => (props.part.tone ?? 'quiet') as BadgeTone);
</script>

<template>
    <SwitchCase :value="part.style">
        <template #heading>
            <h2 class="font-semibold text-card text-text">
                {{ part.text }}
            </h2>
        </template>
        <template #badge>
            <StateBadge :label="part.text ?? ''" :tone="badgeTone" />
        </template>
        <template #paragraph>
            <p class="text-body whitespace-pre-wrap text-text">
                {{ part.text }}
            </p>
        </template>
        <template #code>
            <code class="font-mono text-field">{{ part.text }}</code>
        </template>
        <template #time>
            <span data-layout-text="time" class="text-text-3"
                >{{ part.text }}
                <time :datetime="part.detail ?? ''">{{
                    dateTime(part.detail ?? '')
                }}</time></span
            >
        </template>
        <template #muted>
            <span data-layout-text="muted" class="text-text-3">{{
                part.text
            }}</span>
        </template>
        <template #default>
            <span :data-layout-text="part.style" class="text-text">{{
                part.text
            }}</span>
        </template>
    </SwitchCase>
</template>
