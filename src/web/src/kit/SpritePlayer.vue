<script setup>
import {computed, ref, watch} from "vue";

const RATE = 3.5;

const props = defineProps({
    url: {type: String, required: true},
    size: {type: Number, default: 128},
    playing: Boolean,
    turn: {type: Number, default: 0},
});
const emit = defineEmits(["ended", "measured"]);
const frames = ref(0);

watch(
    () => props.url,
    (url) => {
        frames.value = 0;
        const probe = new Image();
        probe.onload = () => {
            frames.value = Math.max(1, Math.round(probe.naturalWidth / probe.naturalHeight));
            emit("measured", frames.value);
        };
        probe.src = url;
    },
    {immediate: true}
);

const look = computed(() => ({
    width: `${props.size}px`,
    height: `${props.size}px`,
    backgroundImage: `url(${props.url})`,
    backgroundSize: `${props.size * frames.value}px ${props.size}px`,
    "--size": `${props.size}px`,
    "--frames": frames.value,
    "--seconds": `${frames.value / RATE}s`,
}));
</script>

<template>
    <span :key="turn" :class="['sprite-player', {playing: playing && frames > 0}]" :style="look" aria-hidden="true" @animationend="emit('ended')"></span>
</template>

<style scoped>
.sprite-player {
    display: block;
    background-position: 0 0;
    background-repeat: no-repeat;
}

.sprite-player.playing {
    animation: sprite-player-frames var(--seconds) steps(var(--frames)) 1;
}

@keyframes sprite-player-frames {
    from {
        background-position-x: 0;
    }

    to {
        background-position-x: calc(var(--size) * var(--frames) * -1);
    }
}
</style>
