<script setup>
import {computed} from "vue";
import Btn from "../src/kit/Btn.vue";

const props = defineProps({player: {type: Object, required: true}});

const view = computed(() => props.player.view);
const running = computed(() => !view.value.move && !view.value.finishing && !view.value.ended);
</script>

<template>
    <div class="lesson-status">
        <span class="lesson-status-line" role="status">{{ player.line }}</span>
        <template v-if="running">
            <Btn
                small
                :title="view.paused ? 'Carry on with the lesson' : 'Stop the lesson where it is'"
                @click="view.paused ? player.resume() : player.pause()"
            >
                {{ view.paused ? "Play" : "Pause" }}
            </Btn>
            <Btn small :class="{on: view.slower}" title="Play the lesson at half speed" @click="player.slow()">Slower</Btn>
        </template>
    </div>
</template>

<style scoped>
.lesson-status {
    display: flex;
    align-items: center;
    gap: 6px;
    min-width: 0;
    font-size: 12px;
}

.lesson-status-line {
    flex: 1;
    min-width: 0;
    font-weight: 600;
}

.on {
    background: var(--accent);
    color: #fff;
}
</style>
