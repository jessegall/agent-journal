<script setup lang="ts">
import Icon from './Icon.vue';
import Input from './Input.vue';

/**
 * Filters a list from a field at its top: a 14 px search icon and a borderless input, padding 9 12, a --line rule
 * below. The input keeps focus; Up and Down ask the list to move its active row, Enter to run it and Escape to close.
 * `controls` names the list's id and `activeDescendant` the active row's id.
 */
defineProps<{ label: string; placeholder?: string; controls?: string; activeDescendant?: string }>();
const value = defineModel<string>({ default: '' });
const emit = defineEmits<{ move: [step: 1 | -1]; run: []; close: [] }>();

function press(event: KeyboardEvent): void {
    const actions: Record<string, () => void> = {
        ArrowDown: () => emit('move', 1),
        ArrowUp: () => emit('move', -1),
        Enter: () => emit('run'),
        Escape: () => emit('close'),
    };

    if (event.key in actions) {
        event.preventDefault();
        actions[event.key]();
    }
}
</script>

<template>
    <div class="flex items-center gap-2 border-b border-line px-3 py-[9px] text-text-3">
        <Icon name="search" size="md" />
        <Input
            v-model="value"
            bare
            role="combobox"
            aria-autocomplete="list"
            aria-expanded="true"
            :aria-label="label"
            :aria-controls="controls"
            :aria-activedescendant="activeDescendant"
            :placeholder="placeholder"
            autocomplete="off"
            class="flex-1"
            @keydown="press"
        />
    </div>
</template>
