<script setup>
import {computed, onUnmounted, ref, watch} from "vue";
import {CELL, frameMs, frameShift} from "../domain/mascots.js";

const props = defineProps({
    url: {type: String, required: true},
    size: {type: Number, default: 128},
    playing: Boolean,
    loop: Boolean,
    frame: {type: Number, default: 0},
    edit: {type: Object, default: null},
});
const emit = defineEmits(["ended", "frame", "measured"]);
const frames = ref(0);
const at = ref(0);
let timer = 0;

const halt = () => clearTimeout(timer);

function schedule() {
    halt();
    if (props.playing && frames.value) timer = setTimeout(advance, frameMs(props.edit, at.value));
}

function advance() {
    if (at.value + 1 >= frames.value) {
        if (!props.loop) return emit("ended");
        at.value = -1;
    }
    at.value += 1;
    emit("frame", at.value);
    schedule();
}

watch(
    () => props.url,
    (url) => {
        halt();
        frames.value = 0;
        at.value = 0;
        const probe = new Image();
        probe.onload = () => {
            if (url !== props.url) return;
            frames.value = Math.max(1, Math.round(probe.naturalWidth / probe.naturalHeight));
            emit("measured", frames.value);
            schedule();
        };
        probe.src = url;
    },
    {immediate: true}
);
watch(() => props.playing, schedule);
watch(
    () => props.frame,
    (n) => {
        if (!props.playing) at.value = Math.max(0, Math.min(n, frames.value - 1));
    }
);
onUnmounted(halt);

const scale = computed(() => props.size / CELL);
const look = computed(() => {
    const shift = frameShift(props.edit, at.value);
    return {
        width: `${props.size}px`,
        height: `${props.size}px`,
        backgroundImage: `url(${props.url})`,
        backgroundSize: `${props.size * frames.value}px ${props.size}px`,
        backgroundPosition: `${-at.value * props.size}px 0`,
        transform: `translate(${shift.x * scale.value}px, ${shift.y * scale.value}px)`,
    };
});
</script>

<template>
    <span class="sprite-player" :style="look" aria-hidden="true"></span>
</template>

<style scoped>
.sprite-player {
    display: block;
    background-repeat: no-repeat;
}
</style>
