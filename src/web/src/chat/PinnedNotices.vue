<script setup>
import Notice from "./Notice.vue";
import PinsToggle from "./PinsToggle.vue";
import {usePins} from "./pins.js";

const props = defineProps({notices: {type: Array, required: true}, withoutToggle: Boolean});
const {shown} = usePins(() => props.notices);
</script>

<template>
    <div class="pinned">
        <TransitionGroup name="act">
            <template v-for="x in shown" :key="x.n">
                <Notice :notice="x" />
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
