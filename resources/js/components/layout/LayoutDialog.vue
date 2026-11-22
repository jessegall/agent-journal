<script setup lang="ts">
import { router, usePage } from '@inertiajs/vue3';
import { computed, ref, watch } from 'vue';
import Button from '@/components/kit/Button.vue';
import Dialog from '@/components/kit/Dialog.vue';
import Toast from '@/components/kit/Toast.vue';
import { overlayTarget } from '@/composables/overlayLayer';
import type { LayoutPartData } from '@/generated/types/core';
import LayoutPart from './LayoutPart.vue';
import { inertiaMethods, provideFormSent } from './layoutForm';

// A dialog of a declared layout: its opener is drawn in place and opens it; its form sends through the form's own
// registered submission and keeps its draft with the focus on the first invalid field. Cancel and Escape give the
// focus back to the opener, a page change closes it, and once the form is accepted it closes and a toast says so,
// offering Undo only when the declaration supplies an inverse action.
const props = defineProps<{ part: LayoutPartData }>();
const page = usePage();
const isOpen = ref(false);
const isConfirmed = ref(false);
const opener = computed(() => props.part.children[0]);
const form = computed(() => props.part.children[1]);

function openFromOpener(event: MouseEvent): void {
    const isItem = (event.target as Element).closest('[role^="menuitem"]') !== null;

    if (opener.value.tag === 'action' || isItem) {
        isOpen.value = true;
    }
}

function close(): void {
    isOpen.value = false;
}

function confirmed(): void {
    isOpen.value = false;
    isConfirmed.value = true;
}

function undo(): void {
    const inverse = props.part.dialog?.undo;

    if (inverse !== undefined) {
        router.visit(inverse.href, { method: inertiaMethods[inverse.method], data: inverse.fixed, preserveScroll: true });
    }
}

provideFormSent(confirmed);
watch(() => page.url, close);
</script>

<template>
    <span @click="openFromOpener">
        <LayoutPart :part="opener" />
    </span>
    <Dialog :open="isOpen" :title="part.dialog?.title ?? ''" @close="close">
        <LayoutPart :part="form" />
        <template #footer>
            <Button variant="ghost" @click="close">Cancel</Button>
        </template>
    </Dialog>
    <template v-if="isConfirmed">
        <Teleport :to="overlayTarget()">
            <div class="pointer-events-none fixed inset-0 z-(--z-toast)">
                <Toast
                    class="pointer-events-auto"
                    :text="part.dialog?.confirmation ?? ''"
                    :undo="part.dialog?.undo !== undefined"
                    @undo="undo"
                    @close="isConfirmed = false"
                />
            </div>
        </Teleport>
    </template>
</template>
