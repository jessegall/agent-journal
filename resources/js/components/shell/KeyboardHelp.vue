<script setup lang="ts">
import Dialog from '@/components/kit/Dialog.vue';
import Kbd from '@/components/kit/Kbd.vue';
import { useShellOverlays } from '@/composables/useShellOverlays';
import { shortcutGroups } from './shortcuts';

/**
 * The keyboard help, a modal dialog over the page as the design draws it: a plain title over one list of every
 * shortcut the app has, its keys in Kbd right-aligned on the left and what they do on the right. It scrolls inside the
 * dialog, traps the focus, and Escape closes it and gives the focus back to what opened it.
 */
const { isHelpOpen } = useShellOverlays();
const shortcuts = shortcutGroups.flatMap((group) => group.shortcuts);
</script>

<template>
    <Dialog :open="isHelpOpen" title="Keyboard shortcuts" size="md" :header="false" @close="isHelpOpen = false">
        <div class="flex max-h-[70dvh] flex-col gap-3 overflow-y-auto">
            <h2 class="m-0 text-body font-semibold text-text">Keyboard shortcuts</h2>
            <dl class="m-0 grid grid-cols-[minmax(0,auto)_1fr] items-baseline gap-x-4 gap-y-2 text-small">
                <template v-for="(shortcut, place) in shortcuts" :key="place">
                    <dt class="flex flex-wrap justify-end gap-1">
                        <template v-for="key in shortcut.keys" :key="key">
                            <Kbd>{{ key }}</Kbd>
                        </template>
                    </dt>
                    <dd class="m-0 text-text-2">{{ shortcut.does }}</dd>
                </template>
            </dl>
        </div>
    </Dialog>
</template>
