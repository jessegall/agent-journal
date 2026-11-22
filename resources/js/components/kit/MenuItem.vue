<script setup lang="ts">
import { computed } from 'vue';
import Icon from './Icon.vue';

/**
 * One row of a Menu: a leading slot (an Icon at 14, an Avatar sm, or nothing), the label and subline in the default
 * slot, and a trailing slot (a bare Kbd). A ticked item (checked is true or false) is a menuitemcheckbox, or a
 * menuitemradio when it is one of a choice, and draws a tick while it is checked. It runs on a click, Enter or Space
 * and never when it is disabled; the Menu above it moves focus between items and skips a disabled one.
 */
const props = withDefaults(
    defineProps<{
        checked?: boolean;
        radio?: boolean;
        disabled?: boolean;
        active?: boolean;
    }>(),
    { checked: undefined, radio: false, disabled: false, active: false },
);

const emit = defineEmits<{ run: [event: Event] }>();

const role = computed(() => {
    if (props.checked === undefined) {
        return 'menuitem';
    }

    return props.radio ? 'menuitemradio' : 'menuitemcheckbox';
});

function run(event: Event): void {
    if (props.disabled) {
        return;
    }

    emit('run', event);
}

function runOnKey(event: KeyboardEvent): void {
    if (event.key !== 'Enter' && event.key !== ' ') {
        return;
    }

    event.preventDefault();
    run(event);
}
</script>

<template>
    <div
        :role="role"
        :aria-checked="checked === undefined ? undefined : checked"
        :aria-disabled="disabled || undefined"
        tabindex="-1"
        class="flex w-full cursor-pointer items-center gap-[9px] rounded-control px-2 py-1.5 text-left text-small text-text-2 outline-none hover:bg-hover hover:text-text focus-visible:bg-sel focus-visible:text-text focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-focus"
        :class="[
            active && 'bg-sel text-text ring-2 ring-inset ring-focus',
            disabled && 'cursor-default opacity-45 hover:bg-transparent hover:text-text-2',
        ]"
        @click="run"
        @keydown="runOnKey"
    >
        <span v-if="$slots.leading" class="flex shrink-0 items-center">
            <slot name="leading" />
        </span>
        <span class="flex min-w-0 flex-1 flex-col">
            <slot />
        </span>
        <span v-if="checked" class="flex shrink-0 items-center">
            <Icon name="tick" :size="14" />
        </span>
        <span v-if="$slots.trailing" class="flex shrink-0 items-center">
            <slot name="trailing" />
        </span>
    </div>
</template>
