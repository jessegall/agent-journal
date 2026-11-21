<script setup lang="ts">
/**
 * One choice of a group of cards: its title, a grey word on the right such as what it bills, and one sentence under
 * the title. A chosen card has the blue outline. It is a radio: OptionCards moves the choice with the arrow keys and
 * names the one card the Tab key stops at.
 */
defineProps<{
    title: string;
    aside: string;
    description: string;
    isChosen: boolean;
    isTabStop: boolean;
}>();

const emit = defineEmits<{
    choose: [];
    confirm: [];
}>();

defineSlots<{
    icon?: () => unknown;
}>();

function chooseByKey(event: KeyboardEvent): void {
    if (event.key !== ' ' && event.key !== 'Enter') {
        return;
    }

    event.preventDefault();
    emit(event.key === 'Enter' ? 'confirm' : 'choose');
}
</script>

<template>
    <div
        role="radio"
        :aria-checked="isChosen"
        :tabindex="isTabStop ? 0 : -1"
        class="flex cursor-pointer flex-col gap-1 rounded-field border bg-bg px-3.5 py-3 hover:bg-hover focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand"
        :class="
            isChosen
                ? 'border-brand shadow-[inset_0_0_0_1px_var(--brand)]'
                : 'border-border-2'
        "
        @click="emit('choose')"
        @dblclick="emit('confirm')"
        @keydown="chooseByKey"
    >
        <div class="flex items-start gap-2.5">
            <span class="mt-px"><slot name="icon" /></span>
            <span class="flex-1 text-card leading-5 font-medium text-text">{{
                title
            }}</span>
            <span class="text-small leading-5 whitespace-nowrap text-text-3">{{
                aside
            }}</span>
        </div>
        <span class="pl-7 text-small leading-normal text-text-2">{{
            description
        }}</span>
    </div>
</template>
