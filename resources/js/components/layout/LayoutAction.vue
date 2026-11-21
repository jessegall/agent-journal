<script setup lang="ts">
import { useId } from 'vue';
import Button from '@/components/kit/Button.vue';
import { useWindowQueryChange } from '@/framework/useWindowQuery';
import type { LayoutPartData } from '@/generated/types/core';
import { useLayoutForm } from './layoutForm';

// An action of a declared layout: a link to a page, a link that changes only its own window's query, or a disabled
// button whose reason stays readable beside it and is its accessible description.
const props = defineProps<{ part: LayoutPartData }>();
const windowQuery = useWindowQueryChange();
const form = useLayoutForm();
const reasonId = `layout-reason-${useId()}`;
const style = props.part.style as 'bordered' | 'ghost' | 'primary' | 'danger';
const size = (props.part.size ?? 'normal') as 'small' | 'normal' | 'large';

function hrefOf(part: LayoutPartData): string | undefined {
    if (part.action?.href) {
        return part.action.href;
    }

    return part.action !== undefined &&
        Object.keys(part.action.query).length > 0
        ? windowQuery(part.action.query)
        : undefined;
}
</script>

<template>
    <template v-if="part.action?.reason">
        <span class="inline-flex items-center gap-2">
            <Button
                :variant="style"
                :size="size"
                disabled
                :aria-describedby="reasonId"
                >{{ part.text }}</Button
            >
            <span :id="reasonId" class="text-small text-text-3">{{
                part.action.reason
            }}</span>
        </span>
    </template>
    <template v-else>
        <Button :variant="style" :size="size" :href="hrefOf(part)">{{
            part.text
        }}</Button>
    </template>
</template>
