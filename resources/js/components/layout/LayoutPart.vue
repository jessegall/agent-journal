<script setup lang="ts">
import type { Component } from 'vue';
import LayoutAction from '@/components/layout/LayoutAction.vue';
import LayoutBody from '@/components/layout/LayoutBody.vue';
import LayoutBox from '@/components/layout/LayoutBox.vue';
import LayoutCollection from '@/components/layout/LayoutCollection.vue';
import LayoutField from '@/components/layout/LayoutField.vue';
import LayoutForm from '@/components/layout/LayoutForm.vue';
import LayoutNative from '@/components/layout/LayoutNative.vue';
import LayoutNotice from '@/components/layout/LayoutNotice.vue';
import LayoutTabs from '@/components/layout/LayoutTabs.vue';
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
    action: LayoutAction,
    field: LayoutField,
    form: LayoutForm,
    tabs: LayoutTabs,
    body: LayoutBody,
    native: LayoutNative,
};
</script>

<template>
    <component :is="partComponents[part.tag]" :part="part" />
</template>
