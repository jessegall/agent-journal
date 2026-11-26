<script setup lang="ts">
import { onBeforeUnmount, onMounted, provide, useId, useTemplateRef } from 'vue';
import PanelBody from './PanelBody.vue';
import PanelHeader from './PanelHeader.vue';
import { panelTitleIdKey } from './panelTitleId';

/**
 * A panel that belongs to the page beside it, open over it and not modal: a PanelHeader over a scrolling PanelBody,
 * placed in the chat or at the side. It is a dialog named by its title that opens on its close button, closes on
 * Escape, and returns the focus where it was. Measures: docs/designs/kit-components.md.
 */
withDefaults(
    defineProps<{ title: string; count?: number; closeLabel?: string; placement?: 'chat' | 'side' }>(),
    { count: undefined, closeLabel: 'Close', placement: 'chat' },
);

const emit = defineEmits<{ close: [] }>();

const titleId = `panel-title-${useId()}`;
const panel = useTemplateRef<HTMLElement>('panel');
const opener = document.activeElement as HTMLElement | null;

provide(panelTitleIdKey, titleId);

onMounted(() => panel.value?.querySelector<HTMLElement>('[data-panel-close]')?.focus());
onBeforeUnmount(() => opener?.focus());
</script>

<template>
    <Transition
        appear
        enter-active-class="transition duration-(--duration-panel) ease-journal motion-reduce:transition-none"
        enter-from-class="translate-x-6 opacity-0 motion-reduce:translate-x-0 motion-reduce:opacity-100"
        leave-active-class="transition duration-(--duration-pop) ease-journal motion-reduce:transition-none"
        leave-to-class="translate-x-6 opacity-0 motion-reduce:translate-x-0 motion-reduce:opacity-100"
    >
        <section
            ref="panel"
            role="dialog"
            :aria-labelledby="titleId"
            class="absolute z-(--z-chat-panel) flex flex-col overflow-hidden rounded-card border border-border-2 bg-raised shadow-(--shadow-pop)"
            :class="
                placement === 'chat'
                    ? 'top-2 right-1 bottom-2 w-[min(380px,calc(100%-8px))]'
                    : 'top-0 right-0 bottom-0 w-[min(380px,100%)]'
            "
            @keydown.escape.stop="emit('close')"
        >
            <PanelHeader :title="title" :count="count" :close-label="closeLabel" @close="emit('close')">
                <template v-if="$slots.leading" #leading>
                    <slot name="leading" />
                </template>
            </PanelHeader>
            <PanelBody>
                <slot />
            </PanelBody>
        </section>
    </Transition>
</template>
