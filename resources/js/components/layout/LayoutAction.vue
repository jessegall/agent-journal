<script setup lang="ts">
import { router } from '@inertiajs/vue3';
import { ref, useId } from 'vue';
import Button from '@/components/kit/Button.vue';
import { useHostProp } from '@/framework/hostProp';
import { useWindowQueryChange } from '@/framework/useWindowQuery';
import type { LayoutPartData } from '@/generated/types/core';
import { useLayoutAppend } from './layoutAppend';
import { useLayoutForm } from './layoutForm';

// An action of a declared layout: a link to a page, a link that changes only its own window's query, or a disabled
// button whose reason stays readable beside it and is its accessible description. An action that appends reads the
// next rows into its window and adds them to the rows shown; when that read fails it keeps them, says so and can be
// pressed again.
const props = defineProps<{ part: LayoutPartData }>();
const windowQuery = useWindowQueryChange();
const form = useLayoutForm();
const hostProp = useHostProp();
const isAppending = useLayoutAppend();
const isReading = ref(false);
const failed = ref(false);
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

function showMore(): void {
    isReading.value = true;
    failed.value = false;
    isAppending.value = true;

    router.visit(hrefOf(props.part) ?? '', {
        only: [hostProp],
        preserveState: true,
        preserveScroll: true,
        onNetworkError: () => {
            failed.value = true;

            return true;
        },
        onHttpException: () => {
            failed.value = true;

            return true;
        },
        onFinish: () => {
            isReading.value = false;
            isAppending.value = false;
        },
    });
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
    <template v-else-if="part.action?.appends">
        <span class="inline-flex items-center gap-2">
            <Button :variant="style" :size="size" :pending="isReading" @click="showMore">{{
                part.text
            }}</Button>
            <template v-if="failed">
                <span role="alert" class="text-small text-danger"
                    >More could not be read. The rows above are kept.</span
                >
            </template>
        </span>
    </template>
    <template v-else>
        <Button :variant="style" :size="size" :href="hrefOf(part)">{{
            part.text
        }}</Button>
    </template>
</template>
