<script setup>
// A part of the chat that appears after its message is shown: it grows from no height to its own while it fades in, so the chat moves
// smoothly round it instead of jumping; shown with its message from the start, it is simply there
defineProps({shown: {type: Boolean, required: true}});
</script>

<template>
    <Transition name="grow-in">
        <template v-if="shown">
            <div class="grow-in">
                <div class="grow-in-inner">
                    <slot />
                </div>
            </div>
        </template>
    </Transition>
</template>

<style scoped>
.grow-in {
    display: grid;
    grid-template-rows: 1fr;
}

.grow-in-inner {
    min-height: 0;
}

.grow-in-enter-active,
.grow-in-leave-active {
    transition:
        grid-template-rows 0.26s ease,
        opacity 0.26s ease;
}

.grow-in-enter-active .grow-in-inner,
.grow-in-leave-active .grow-in-inner {
    overflow: hidden;
}

.grow-in-enter-from,
.grow-in-leave-to {
    grid-template-rows: 0fr;
    opacity: 0;
}
</style>
