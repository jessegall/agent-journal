<script setup lang="ts">
import { router } from '@inertiajs/vue3';
import Toast from '@/components/kit/Toast.vue';
import { overlayTarget } from '@/composables/overlayLayer';
import type { LayoutFormData } from '@/generated/types/core';
import { inertiaMethods } from './layoutForm';

// What a layout says once a form was accepted: a toast with the sentence, and Undo only when the declaration gives an
// inverse form to send.
const props = defineProps<{ text: string; undo?: LayoutFormData }>();
defineEmits<{ close: [] }>();

function undo(): void {
    if (props.undo !== undefined) {
        router.visit(props.undo.href, {
            method: inertiaMethods[props.undo.method],
            data: props.undo.fixed,
            preserveScroll: true,
        });
    }
}
</script>

<template>
    <Teleport :to="overlayTarget()">
        <div class="pointer-events-none fixed inset-0 z-(--z-toast)">
            <Toast
                class="pointer-events-auto"
                :text="text"
                :undo="undo !== undefined"
                @undo="undo"
                @close="$emit('close')"
            />
        </div>
    </Teleport>
</template>
