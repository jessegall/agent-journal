<script setup>
import {computed} from "vue";
import {chanceOf, weightOf} from "../domain/mascots.js";

const props = defineProps({schedule: {type: Object, required: true}, idle: {type: Array, default: () => []}});
const emit = defineEmits(["change"]);

const paths = computed(() => props.idle.map((animation) => animation.path));
const number = (event) => Number(event.target.value) || 0;
const range = (kind, end, event) => emit("change", {...props.schedule, [kind]: {...props.schedule[kind], [end]: number(event)}});
const move = (axis, event) => emit("change", {...props.schedule, place: {...props.schedule.place, [axis]: number(event)}});
const weigh = (path, event) => emit("change", {...props.schedule, weights: {...props.schedule.weights, [path]: number(event)}});
const nameOf = (animation) => (animation.name ? animation.name.replace(/_/g, " ") : "default");
</script>

<template>
    <div class="schedule">
        <h4>Schedule</h4>
        <div class="schedule-line">
            <span>Blink every</span>
            <input type="number" min="1" :value="schedule.blink.min" aria-label="Fewest seconds between blinks" @input="range('blink', 'min', $event)" />
            <span>to</span>
            <input type="number" min="1" :value="schedule.blink.max" aria-label="Most seconds between blinks" @input="range('blink', 'max', $event)" />
            <span>seconds</span>
        </div>
        <div class="schedule-line">
            <span>Idle animation every</span>
            <input type="number" min="1" :value="schedule.idle.min" aria-label="Fewest seconds between idle animations" @input="range('idle', 'min', $event)" />
            <span>to</span>
            <input type="number" min="1" :value="schedule.idle.max" aria-label="Most seconds between idle animations" @input="range('idle', 'max', $event)" />
            <span>seconds</span>
        </div>
        <span class="schedule-title">Place on the chat box</span>
        <div class="schedule-line">
            <span>Move right</span>
            <input type="number" :value="schedule.place?.x || 0" aria-label="Pixels to move right" @input="move('x', $event)" />
            <span>down</span>
            <input type="number" :value="schedule.place?.y || 0" aria-label="Pixels to move down" @input="move('y', $event)" />
            <span>px</span>
        </div>
        <template v-if="idle.length">
            <span class="schedule-title">Which idle animation plays</span>
            <template v-for="animation in idle" :key="animation.path">
                <label class="schedule-weight">
                    <span class="schedule-name">{{ nameOf(animation) }}</span>
                    <input type="number" min="0" :value="weightOf(schedule, animation.path)" aria-label="Weight" @input="weigh(animation.path, $event)" />
                    <span class="schedule-chance">{{ chanceOf(schedule, paths, animation.path) }}%</span>
                </label>
            </template>
        </template>
    </div>
</template>

<style scoped>
.schedule {
    display: flex;
    flex-direction: column;
    gap: 8px;
}

h4 {
    margin: 0;
    font-size: 13px;
}

.schedule-line,
.schedule-weight {
    display: flex;
    align-items: center;
    gap: 6px;
    color: var(--text-2);
    font-size: 12px;
}

.schedule-title {
    margin-top: 4px;
    color: var(--text-3);
    font-size: 11.5px;
}

.schedule-name {
    flex: 1;
    min-width: 0;
}

.schedule-chance {
    width: 38px;
    color: var(--text-3);
    text-align: right;
}

input {
    width: 54px;
    padding: 4px 6px;
    border: 1px solid var(--border);
    border-radius: 6px;
    background: transparent;
    color: var(--text);
    font: inherit;
}
</style>
