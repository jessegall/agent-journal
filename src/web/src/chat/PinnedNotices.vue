<script setup>
import ChatNotice from "./ChatNotice.vue";
import PinsToggle from "./PinsToggle.vue";
import {computed, ref} from "vue";
import {usePins} from "./pins.js";

const props = defineProps({notices: {type: Array, required: true}, withoutToggle: Boolean});
const {visible} = usePins(() => props.notices);
const closing = ref(new Set());
const shown = computed(() => visible.value.filter((x) => !closing.value.has(x.n)));
const hide = (n) => (closing.value = new Set([...closing.value, n]));
const show = (n) => (closing.value = new Set([...closing.value].filter((one) => one !== n)));
</script>

<template>
    <div class="pinned">
        <TransitionGroup name="act">
            <template v-for="x in shown" :key="x.n">
                <ChatNotice :notice="x" @closing="hide" @failed="show" />
            </template>
        </TransitionGroup>
        <template v-if="!withoutToggle">
            <PinsToggle :notices="notices" />
        </template>
    </div>
</template>

<style scoped>
.pinned {
    position: relative;
    z-index: 3;
    flex: none;
    display: flex;
    flex-direction: column;
}
</style>
