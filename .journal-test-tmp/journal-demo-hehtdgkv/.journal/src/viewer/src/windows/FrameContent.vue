<script setup>
import {onMounted, onUnmounted, ref} from "vue";
import {useWindow} from "@journal/window-kit";
import Btn from "../kit/Btn.vue";
import {FrameBridge} from "./frameBridge.js";

const CHECK_MS = 1000;

const props = defineProps({src: {type: String, required: true}});
const context = useWindow();
const frame = ref(null);
const silent = ref(false);
const closed = ref(false);
let bridge = null;
let check = 0;

onMounted(() => {
    bridge = new FrameBridge(frame.value, context);
    bridge.start();
    check = setInterval(() => {
        silent.value = bridge.silent();
    }, CHECK_MS);
});

onUnmounted(() => {
    bridge?.stop();
    clearInterval(check);
});
</script>

<template>
    <template v-if="closed">
        <p class="frame-note">This window was closed because it stopped answering.</p>
    </template>
    <template v-else>
        <template v-if="silent">
            <div class="frame-note">
                <p>This window has not answered for ten seconds.</p>
                <Btn @click="closed = true">Close the window</Btn>
            </div>
        </template>
        <iframe ref="frame" class="frame-window" sandbox="allow-scripts" :src="props.src" :title="context.window" />
    </template>
</template>

<style scoped>
.frame-window {
    width: 100%;
    height: 100%;
    border: 0;
}

.frame-note {
    display: flex;
    gap: 8px;
    align-items: center;
    color: var(--text-2);
}
</style>
