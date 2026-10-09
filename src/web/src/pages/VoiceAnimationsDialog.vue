<script setup>
import {computed, ref} from "vue";
import {animationLabel, groupedByKind} from "../domain/mascots.js";
import {animations, dropAnimations, urlOf} from "../composables/voiceAnimations.js";
import Btn from "../kit/Btn.vue";
import Dialog from "../kit/Dialog.vue";
import EmptyState from "../kit/EmptyState.vue";
import Notice from "../kit/Notice.vue";
import SectionHeading from "../kit/SectionHeading.vue";
import SpritePlayer from "../kit/SpritePlayer.vue";

const props = defineProps({row: {type: Object, required: true}});
defineEmits(["close"]);

const groups = computed(() => groupedByKind(animations.value[props.row.n] || []));
const flat = computed(() => groups.value.flatMap((group) => group.items));
const chosen = ref(null);
const playing = ref(false);
const turn = ref(0);
const everything = ref(false);
const over = ref(false);
const busy = ref(false);
const failed = ref("");
const picker = ref(null);

const place = computed(() => flat.value.findIndex((animation) => animation.path === chosen.value?.path));

function show(animation) {
    chosen.value = animation;
    replay();
}

function replay() {
    if (!chosen.value) return;
    turn.value += 1;
    playing.value = true;
}

function step(by) {
    everything.value = false;
    const next = flat.value[place.value + by];
    if (next) show(next);
}

function playEverything() {
    everything.value = true;
    show(flat.value[0]);
}

function ended() {
    playing.value = false;
    const next = everything.value ? flat.value[place.value + 1] : null;
    if (next) show(next);
    else everything.value = false;
}

async function take(files) {
    if (!files.length) return;
    busy.value = true;
    failed.value = "";
    try {
        await dropAnimations(props.row, files);
    } catch (error) {
        failed.value = error.message;
    } finally {
        busy.value = false;
    }
}

function dropped(event) {
    over.value = false;
    take([...event.dataTransfer.files]);
}

function picked(event) {
    take([...event.target.files]);
    event.target.value = "";
}
</script>

<template>
    <Dialog :title="`${row.title} animations`" wide @close="$emit('close')">
        <div :class="['voice-animations', {over}]" @dragover.prevent="over = true" @dragleave="over = false" @drop.prevent="dropped">
            <div class="voice-animations-list">
                <template v-for="group in groups" :key="group.kind">
                    <SectionHeading>{{ group.kind }}</SectionHeading>
                    <template v-for="animation in group.items" :key="animation.path">
                        <button
                            type="button"
                            :class="['voice-animations-item', {current: animation.path === chosen?.path}]"
                            @click="everything = false; show(animation)"
                        >
                            {{ animation.name ? animation.name.replace(/_/g, " ") : "default" }}
                            <template v-if="!animation.shipped"><span class="voice-animations-mine">yours</span></template>
                        </button>
                    </template>
                </template>
                <template v-if="!groups.length">
                    <EmptyState>This voice has no animations yet. Drop sheets or a ZIP here.</EmptyState>
                </template>
            </div>
            <div class="voice-animations-stage">
                <div class="voice-animations-screen">
                    <template v-if="chosen">
                        <SpritePlayer :url="urlOf(row.n, chosen)" :playing="playing" :turn="turn" @ended="ended" />
                    </template>
                    <template v-else>
                        <span class="voice-animations-hint">Pick an animation to play it at its real size.</span>
                    </template>
                </div>
                <span class="voice-animations-name">{{ chosen ? animationLabel(chosen) : "" }}</span>
                <div class="voice-animations-controls">
                    <Btn small :disabled="place < 1" @click="step(-1)">Previous</Btn>
                    <Btn small :disabled="!chosen" @click="everything = false; replay()">Replay</Btn>
                    <Btn small :disabled="place < 0 || place >= flat.length - 1" @click="step(1)">Next</Btn>
                    <Btn small kind="primary" :disabled="!flat.length" @click="playEverything">Play all</Btn>
                </div>
            </div>
        </div>
        <template v-if="failed">
            <Notice>{{ failed }}</Notice>
        </template>
        <template #foot>
            <div class="voice-animations-foot">
                <span class="voice-animations-drop">Drop PNG sheets or a ZIP here, named like idle_wave.png, working_left.png or blink.png.</span>
                <input ref="picker" type="file" accept=".png,.zip,image/png,application/zip" multiple hidden @change="picked" />
                <Btn small :busy="busy" @click="picker.click()">Add animations</Btn>
            </div>
        </template>
    </Dialog>
</template>

<style scoped>
.voice-animations {
    display: flex;
    gap: 16px;
    height: 340px;
    border: 1px dashed transparent;
    border-radius: 10px;
}

.voice-animations.over {
    border-color: var(--accent);
    background: color-mix(in srgb, var(--accent) 6%, transparent);
}

.voice-animations-list {
    display: flex;
    flex: 1;
    flex-direction: column;
    gap: 2px;
    min-width: 0;
    padding-right: 6px;
    overflow-y: auto;
}

.voice-animations-item {
    display: flex;
    align-items: center;
    gap: 8px;
    padding: 6px 8px;
    border: 0;
    border-radius: 6px;
    background: none;
    color: var(--text);
    font: inherit;
    font-size: 13px;
    text-align: left;
    cursor: pointer;
}

.voice-animations-item:hover,
.voice-animations-item.current {
    background: var(--hover, color-mix(in srgb, var(--text) 8%, transparent));
}

.voice-animations-mine {
    color: var(--text-3);
    font-size: 11px;
}

.voice-animations-stage {
    display: flex;
    flex: none;
    flex-direction: column;
    align-items: center;
    gap: 10px;
    width: 220px;
}

.voice-animations-screen {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 200px;
    height: 200px;
    border: 1px solid var(--border);
    border-radius: 10px;
}

.voice-animations-hint {
    padding: 0 14px;
    color: var(--text-3);
    font-size: 12px;
    text-align: center;
}

.voice-animations-name {
    min-height: 18px;
    color: var(--text-2);
    font-size: 12.5px;
}

.voice-animations-controls {
    display: flex;
    flex-wrap: wrap;
    justify-content: center;
    gap: 6px;
}

.voice-animations-foot {
    display: flex;
    align-items: center;
    gap: 12px;
    width: 100%;
}

.voice-animations-drop {
    flex: 1;
    color: var(--text-3);
    font-size: 12px;
}
</style>
