<script setup>
import {ref} from "vue";
import ActionSheet from "./ActionSheet.vue";
import NavBar from "./NavBar.vue";
import {useScrolled} from "./scrolled.js";

defineProps({
    title: {type: String, required: true},
    back: {type: String, default: ""},
    about: {type: String, required: true},
    actions: {type: Array, default: () => []},
});
const emit = defineEmits(["back"]);
const moreOpen = ref(false);
const {under, scrolled} = useScrolled();
</script>

<template>
    <div class="screen">
        <NavBar :title="title" :back="back" :under="under" @back="emit('back')">
            <slot name="end" />
        </NavBar>
        <div class="screen-scroll" data-scroller @scroll.passive="scrolled">
            <slot />
        </div>
        <template v-if="$slots.primary || actions.length">
            <footer class="screen-foot item-bar">
                <slot name="primary" />
                <template v-if="actions.length">
                    <button type="button" class="item-more" aria-haspopup="dialog" @click="moreOpen = true">More</button>
                </template>
            </footer>
        </template>
        <template v-if="moreOpen">
            <ActionSheet :title="title" :about="about" :actions="actions" @close="moreOpen = false" />
        </template>
    </div>
</template>

<style scoped>
.item-bar {
    display: grid;
    grid-auto-columns: minmax(0, 1fr);
    grid-auto-flow: column;
    gap: 8px;
}

.item-more {
    min-height: 44px;
    border: 0;
    border-radius: 12px;
    background: var(--sel);
    color: var(--text);
    font: inherit;
    font-weight: 600;
}
</style>
