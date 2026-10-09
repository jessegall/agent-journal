<script setup>
import {computed, onUnmounted, ref, watch} from "vue";
import {api} from "../api/client.js";
import {poseAt, rigUrl, transforms} from "../domain/rig.js";

const props = defineProps({
    voice: {type: String, required: true},
    rig: {type: Object, required: true},
    move: {type: Object, default: null},
    size: {type: Number, default: 128},
    loop: Boolean,
    paused: Boolean,
    at: {type: Number, default: -1},
});
const emit = defineEmits(["ended", "time"]);
const ms = ref(0);
let frame = 0;
let started = 0;

const halt = () => cancelAnimationFrame(frame);

function tick(now) {
    if (!started) started = now - ms.value;
    ms.value = now - started;
    emit("time", ms.value);
    if (ms.value >= props.move.duration) {
        if (!props.loop) {
            ms.value = props.move.duration;
            return emit("ended");
        }
        started = now;
        ms.value = 0;
    }
    frame = requestAnimationFrame(tick);
}

function run() {
    halt();
    started = 0;
    if (props.move && !props.paused && props.at < 0) frame = requestAnimationFrame(tick);
}

watch(
    () => [props.move, props.paused],
    () => {
        if (!props.paused) ms.value = 0;
        run();
    },
    {immediate: true}
);
watch(
    () => props.at,
    (at) => at >= 0 && (ms.value = at)
);
onUnmounted(halt);

const pose = computed(() => (props.move ? poseAt(props.move, props.at >= 0 ? props.at : ms.value) : {}));
const matrices = computed(() => transforms(props.rig, pose.value));
const scale = computed(() => ({transform: `scale(${props.size / 256})`}));
</script>

<template>
    <span class="rig-player" :style="{width: `${size}px`, height: `${size}px`}">
        <span class="rig-stage" :style="scale">
            <template v-for="layer in rig.layers" :key="layer.name">
                <img
                    class="rig-layer"
                    :src="api.publicUrl(rigUrl(voice, layer.file))"
                    alt=""
                    draggable="false"
                    :style="{transform: matrices[layer.name]}"
                />
            </template>
        </span>
    </span>
</template>

<style scoped>
.rig-player {
    position: relative;
    display: inline-block;
    overflow: visible;
}

.rig-stage {
    position: absolute;
    top: 0;
    left: 0;
    width: 256px;
    height: 256px;
    transform-origin: 0 0;
}

.rig-layer {
    position: absolute;
    top: 0;
    left: 0;
    width: 256px;
    height: 256px;
    transform-origin: 0 0;
    image-rendering: auto;
    user-select: none;
}
</style>
