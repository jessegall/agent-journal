<script setup lang="ts">
import type { Component } from 'vue';
import LayoutBox from '@/components/layout/LayoutBox.vue';
import LayoutCollection from '@/components/layout/LayoutCollection.vue';
import LayoutNotice from '@/components/layout/LayoutNotice.vue';
import LayoutText from '@/components/layout/LayoutText.vue';
import type { LayoutPartData, LayoutTag } from '@/generated/types/core';

// One part of a declared layout, handed to the component of its tag. The map names every tag the catalogue has, so a
// tag added in PHP without its component fails the type check.
defineProps<{ part: LayoutPartData }>();

const partComponents: Record<LayoutTag, Component> = {
    box: LayoutBox,
    text: LayoutText,
    collection: LayoutCollection,
    notice: LayoutNotice,
};
</script>

<template>
    <component :is="partComponents[part.tag]" :part="part" />
</template>
