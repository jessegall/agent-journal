<script setup lang="ts">
import { computed } from 'vue';
import SettingsSection from '@/components/kit/SettingsSection.vue';
import LayoutPart from '@/components/layout/LayoutPart.vue';
import type { LayoutPartData } from '@/generated/types/core';

// A settings box of a declared layout: a group in the kit's SettingsSection, its reset and switch as the actions and the
// rest of its parts as the body.
const props = defineProps<{ part: LayoutPartData }>();
const sectionSlots = new Set(['title', 'help', 'reset', 'switch']);
const sectionBody = computed(() => props.part.children.filter((child) => !sectionSlots.has(child.key)));
const sectionActions = computed(() =>
    props.part.children.filter((child) => child.key === 'reset' || child.key === 'switch'),
);

function partNamed(key: string): LayoutPartData | undefined {
    return props.part.children.find((child) => child.key === key);
}
</script>

<template>
    <SettingsSection
        :title="partNamed('title')?.text ?? ''"
        :help="partNamed('help')?.text ?? undefined"
        :spoken="partNamed('title')?.style === 'spoken'"
    >
        <template #actions>
            <template v-for="child in sectionActions" :key="child.key">
                <LayoutPart :part="child" />
            </template>
        </template>
        <template v-for="child in sectionBody" :key="child.key">
            <LayoutPart :part="child" />
        </template>
    </SettingsSection>
</template>
