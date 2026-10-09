<script setup>
import {computed} from "vue";
import {CELL} from "../domain/mascots.js";
import SpritePlayer from "../kit/SpritePlayer.vue";

const SCALE = 1.5;
const MARGIN = 24;
const BOX_ROOM = 70;

const props = defineProps({
    url: {type: String, required: true},
    place: {type: Object, required: true},
    playing: Boolean,
    frame: {type: Number, default: 0},
    edit: {type: Object, default: null},
});
defineEmits(["frame", "measured"]);

const size = CELL * SCALE;
const left = 40;
const top = 12;
const ground = computed(() => top + props.place.line * SCALE);
const corner = computed(() => left + props.place.edge * SCALE + MARGIN * SCALE);
</script>

<template>
    <div class="stage" :style="{width: `${size + left * 2 + 20}px`, height: `${ground + BOX_ROOM}px`}">
        <div class="stage-box" :style="{top: `${ground}px`, width: `${corner}px`}">
            <span class="stage-label">Chat box</span>
        </div>
        <div class="stage-sprite" :style="{left: `${left}px`, top: `${top}px`}">
            <SpritePlayer :url="url" :size="size" :playing="playing" :frame="frame" :edit="edit" loop @frame="$emit('frame', $event)" @measured="$emit('measured', $event)" />
        </div>
    </div>
</template>

<style scoped>
.stage {
    position: relative;
    flex: none;
    border: 1px solid var(--border);
    border-radius: 10px;
    background: color-mix(in srgb, var(--text) 3%, transparent);
    overflow: hidden;
}

.stage-box {
    position: absolute;
    left: 0;
    bottom: 0;
    border-top: 2px solid var(--accent);
    border-right: 2px solid var(--accent);
    border-top-right-radius: 10px;
    background: color-mix(in srgb, var(--accent) 7%, transparent);
}

.stage-label {
    position: absolute;
    bottom: 8px;
    left: 12px;
    color: var(--text-3);
    font-size: 11px;
}

.stage-sprite {
    position: absolute;
}
</style>
