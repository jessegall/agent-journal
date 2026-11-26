<script setup lang="ts" generic="Value extends string | number">
import { computed, nextTick, ref, useId, useTemplateRef } from 'vue';
import { useDropdown } from '@/composables/useDropdown';
import Icon from './Icon.vue';
import ListBox from './ListBox.vue';
import MenuItem from './MenuItem.vue';

/**
 * A choice of one value from a short list: a button with the chosen label that opens a list box, keeping the focus
 * while Enter, Space and the arrows open, move and choose, and Escape closes. Its attributes go to the button, and a
 * disabled option is shown dimmed and passed by.
 */
const props = withDefaults(
    defineProps<{
        options: readonly { value: Value; label: string; disabled?: boolean }[];
        placeholder?: string;
        invalid?: boolean;
    }>(),
    { placeholder: 'Choose one', invalid: false },
);

defineOptions({ inheritAttrs: false });

const value = defineModel<Value | null>({ default: null });
const { isOpen, toggle, close } = useDropdown('root');
const list = useTemplateRef<InstanceType<typeof ListBox>>('list');
const activeId = ref<string | null>(null);
const listId = `select-${useId()}`;
const chosen = computed(() => props.options.find((option) => option.value === value.value));

function optionId(place: number): string {
    return `${listId}-${place}`;
}

async function open(): Promise<void> {
    if (!isOpen.value) {
        toggle();
    }

    const chosen = props.options.findIndex((option) => option.value === value.value);
    await nextTick();
    activeId.value = chosen === -1 ? null : optionId(chosen);
}

function choose(chosen: Value): void {
    value.value = chosen;
    close();
}

// A key of the list moves or chooses in it while it is open, and opens it while it is shut.
function passOrOpen(event: KeyboardEvent): void {
    if (isOpen.value) {
        list.value?.controlKeys(event);

        return;
    }

    void open();
}
</script>

<template>
    <div ref="root" class="relative inline-flex min-w-0 flex-col">
        <button
            v-bind="$attrs"
            type="button"
            aria-haspopup="listbox"
            :aria-expanded="isOpen"
            :aria-controls="listId"
            :aria-activedescendant="isOpen ? (activeId ?? undefined) : undefined"
            :aria-invalid="invalid || undefined"
            class="input inline-flex h-7.5 items-center justify-between gap-2 text-left"
            @click="isOpen ? close() : open()"
            @keydown.down.prevent="passOrOpen"
            @keydown.up.prevent="passOrOpen"
            @keydown.home.prevent="passOrOpen"
            @keydown.end.prevent="passOrOpen"
            @keydown.enter.prevent="passOrOpen"
            @keydown.space.prevent="passOrOpen"
            @keydown.esc="close"
            @keydown.tab="close"
        >
            <span class="truncate" :class="{ 'text-text-4': chosen === undefined }">{{
                chosen?.label ?? placeholder
            }}</span>
            <Icon name="caret" :size="14" class="shrink-0 text-text-3" />
        </button>
        <div
            v-show="isOpen"
            class="absolute top-full z-(--z-menu) mt-1 min-w-full rounded-menu border border-border-2 bg-raised shadow-(--shadow-pop)"
        >
            <ListBox :id="listId" ref="list" v-model:active-id="activeId" label="Choices">
                <template v-for="(option, place) in options" :key="option.value">
                    <MenuItem
                        option
                        :id="optionId(place)"
                        :checked="option.value === value"
                        :disabled="option.disabled"
                        @click="choose(option.value)"
                        >{{ option.label }}</MenuItem
                    >
                </template>
            </ListBox>
        </div>
    </div>
</template>
