<script setup lang="ts" generic="TValue extends string">
import { radioGroupChoice } from '@/composables/radioGroupKeys';
import { nextTick, ref } from 'vue';

/**
 * A switch between a few options side by side, one of them on: a radio group whose arrow keys move the choice and the
 * focus to the next option. An option's icon comes through the icon slot.
 */
const props = defineProps<{
    label: string;
    options: readonly { value: TValue; label: string }[];
}>();

const chosen = defineModel<TValue>({ required: true });

defineSlots<{
    icon?: (props: { value: TValue; isOn: boolean }) => unknown;
}>();

const buttons = ref<HTMLButtonElement[]>([]);

async function moveBy(event: KeyboardEvent): Promise<void> {
    const values = props.options.map((option) => option.value);
    const next = radioGroupChoice(event.key, values, chosen.value);

    if (next === null) {
        return;
    }

    event.preventDefault();
    chosen.value = next;
    await nextTick();
    buttons.value[values.indexOf(next)]?.focus();
}
</script>

<template>
    <div
        role="radiogroup"
        :aria-label="label"
        class="flex gap-0.5 rounded-button bg-chip p-0.5"
        @keydown="moveBy"
    >
        <button
            v-for="option in options"
            :key="option.value"
            ref="buttons"
            type="button"
            role="radio"
            :aria-checked="chosen === option.value"
            :tabindex="chosen === option.value ? 0 : -1"
            class="flex h-7 flex-1 items-center justify-center gap-2 rounded-seg text-field focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand"
            :class="
                chosen === option.value
                    ? 'bg-bg font-medium text-text shadow-[0_1px_2px_rgba(0,0,0,0.08)]'
                    : 'text-text-2'
            "
            @click="chosen = option.value"
        >
            <span
                :class="chosen === option.value ? 'text-text' : 'text-text-3'"
            >
                <slot
                    name="icon"
                    :value="option.value"
                    :is-on="chosen === option.value"
                />
            </span>
            {{ option.label }}
        </button>
    </div>
</template>
