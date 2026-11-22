<script setup lang="ts">
import { nextTick, useId, useTemplateRef } from 'vue';

/**
 * A tab strip bound to its panels: each tab names its labelled panel and the panel names its tab; the arrow keys,
 * Home and End move between the tabs and choose the one they reach. The caller gives the tabs and a slot per tab key.
 */
const props = defineProps<{ tabs: { key: string; label: string }[] }>();
const active = defineModel<string>({ required: true });

const idPrefix = useId();
const buttons = useTemplateRef<HTMLButtonElement[]>('buttons');

function tabId(key: string): string {
    return `${idPrefix}-tab-${key}`;
}

function panelId(key: string): string {
    return `${idPrefix}-panel-${key}`;
}

async function move(event: KeyboardEvent): Promise<void> {
    const current = props.tabs.findIndex((tab) => tab.key === active.value);
    const last = props.tabs.length - 1;
    const targets: Record<string, number> = {
        ArrowRight: current === last ? 0 : current + 1,
        ArrowLeft: current === 0 ? last : current - 1,
        Home: 0,
        End: last,
    };

    if (!(event.key in targets)) {
        return;
    }

    event.preventDefault();
    active.value = props.tabs[targets[event.key]].key;
    await nextTick();
    buttons.value?.[targets[event.key]]?.focus();
}
</script>

<template>
    <div class="flex flex-col">
        <div
            role="tablist"
            class="flex gap-1 border-b border-border"
            @keydown="move"
        >
            <template v-for="tab in tabs" :key="tab.key">
                <button
                    :id="tabId(tab.key)"
                    ref="buttons"
                    type="button"
                    role="tab"
                    :aria-selected="tab.key === active"
                    :aria-controls="panelId(tab.key)"
                    :tabindex="tab.key === active ? 0 : -1"
                    class="-mb-px border-b-2 px-2.5 py-1.5 text-small focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-text"
                    :class="
                        tab.key === active
                            ? 'border-brand text-text'
                            : 'border-transparent text-text-3 hover:text-text'
                    "
                    @click="active = tab.key"
                >
                    {{ tab.label }}
                </button>
            </template>
        </div>
        <template v-for="tab in tabs" :key="tab.key">
            <div
                v-show="tab.key === active"
                :id="panelId(tab.key)"
                role="tabpanel"
                :aria-labelledby="tabId(tab.key)"
                tabindex="0"
                class="pt-3 outline-none focus-visible:outline-2 focus-visible:outline-text"
            >
                <slot :name="tab.key" />
            </div>
        </template>
    </div>
</template>
