<script setup lang="ts" generic="TValue extends string">
import OptionCard from '@/components/kit/OptionCard.vue';
import { radioGroupChoice } from '@/composables/radioGroupKeys';
import { nextTick, ref } from 'vue';

/**
 * A radio group of option cards: a click or an arrow key chooses a card, and Enter or a double click confirms the
 * chosen one. Nothing is chosen until the user chooses.
 */
const props = defineProps<{
    label: string;
    options: readonly {
        value: TValue;
        title: string;
        aside: string;
        description: string;
    }[];
}>();

const chosen = defineModel<TValue | null>({ required: true });

const emit = defineEmits<{
    confirm: [value: TValue];
}>();

defineSlots<{
    icon?: (props: { value: TValue }) => unknown;
}>();

const group = ref<HTMLElement | null>(null);

async function moveBy(event: KeyboardEvent): Promise<void> {
    const values = props.options.map((option) => option.value);
    const next = radioGroupChoice(event.key, values, chosen.value);

    if (next === null) {
        return;
    }

    event.preventDefault();
    chosen.value = next;
    await nextTick();
    group.value
        ?.querySelectorAll<HTMLElement>('[role="radio"]')
        [values.indexOf(next)]?.focus();
}

/**
 * The card that takes the focus when the user tabs in: the chosen one, or the first while none is chosen.
 */
function isTabStop(value: TValue, index: number): boolean {
    return chosen.value === null ? index === 0 : chosen.value === value;
}
</script>

<template>
    <div
        ref="group"
        role="radiogroup"
        :aria-label="label"
        class="flex flex-col gap-2"
        @keydown="moveBy"
    >
        <template v-for="(option, index) in options" :key="option.value">
            <OptionCard
                :title="option.title"
                :aside="option.aside"
                :description="option.description"
                :is-chosen="chosen === option.value"
                :is-tab-stop="isTabStop(option.value, index)"
                @choose="chosen = option.value"
                @confirm="
                    chosen = option.value;
                    emit('confirm', option.value);
                "
            >
                <template #icon>
                    <slot name="icon" :value="option.value" />
                </template>
            </OptionCard>
        </template>
    </div>
</template>
