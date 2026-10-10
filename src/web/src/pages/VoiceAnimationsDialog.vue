<script setup>
import {computed, ref, watch} from "vue";
import {groupedByKind, isAct, placeOf, placedAt} from "../domain/mascots.js";
import {anchorOf, animations, dropAnimations, saveEdit, saveSchedule, scheduleOf, urlOf} from "../composables/voiceAnimations.js";
import {loadRig, rigs, voiceOfArt} from "../composables/voiceRigs.js";
import RigPlayer from "../kit/RigPlayer.vue";
import Btn from "../kit/Btn.vue";
import Dialog from "../kit/Dialog.vue";
import EmptyState from "../kit/EmptyState.vue";
import FrameStrip from "../kit/FrameStrip.vue";
import Notice from "../kit/Notice.vue";
import AnimationList from "./AnimationList.vue";
import AnimationStage from "./AnimationStage.vue";
import FrameFields from "./FrameFields.vue";
import ScheduleFields from "./ScheduleFields.vue";

const props = defineProps({row: {type: Object, required: true}});
defineEmits(["close"]);

const EMPTY = {ms: 0, frames: []};
const copy = (value) => JSON.parse(JSON.stringify(value));

const voice = voiceOfArt(props.row.data.art);
const rigged = computed(() => rigs.value[voice] || null);
const rigMoves = computed(() => (rigged.value ? [...rigged.value.moves, ...(rigged.value.blink ? [rigged.value.blink] : [])] : []));
const moveName = ref("");
const move = computed(() => rigMoves.value.find((each) => each.name === moveName.value) || null);
loadRig(voice);
const groups = computed(() => groupedByKind(animations.value[props.row.n] || []));
const flat = computed(() => groups.value.flatMap((group) => group.items));
const idle = computed(() => flat.value.filter(isAct));
const path = ref("");
const chosen = computed(() => flat.value.find((animation) => animation.path === path.value) || null);
const playing = ref(true);
const at = ref(0);
const count = ref(0);
const draft = ref(copy(EMPTY));
const plan = ref(copy(scheduleOf(props.row.n)));
const over = ref(false);
const busy = ref(false);
const failed = ref("");
const picker = ref(null);
const anchorNote = ref("");

const saved = computed(() => chosen.value?.edit || EMPTY);
const edited = computed(() => JSON.stringify(draft.value) !== JSON.stringify(saved.value));
const planned = computed(() => JSON.stringify(plan.value) !== JSON.stringify(scheduleOf(props.row.n)));
const place = computed(() => placedAt(placeOf(props.row.data.art || ""), plan.value.place));

function pick(animation) {
    path.value = animation.path;
    anchorNote.value = "";
    draft.value = copy(animation.edit || EMPTY);
    at.value = 0;
    count.value = 0;
    playing.value = true;
}

watch(flat, (list) => !chosen.value && list.length && pick(list[0]), {immediate: true});
watch(() => scheduleOf(props.row.n), (now) => (plan.value = copy(now)));

const moveTo = (index) => {
    playing.value = false;
    at.value = Math.max(0, Math.min(index, count.value - 1));
};

async function run(work) {
    busy.value = true;
    failed.value = "";
    try {
        await work();
    } catch (error) {
        failed.value = error.message;
    } finally {
        busy.value = false;
    }
}

const anchoring = computed(() => placeOf(props.row.data.art || ""));
const anchorFrames = () =>
    run(async () => {
        const found = await anchorOf(props.row, chosen.value, anchoring.value);
        anchorNote.value = found.firm ? "" : "No steady spot found: the body of this animation moves. Set the frames by hand.";
        if (!found.firm) return;
        draft.value = {ms: draft.value.ms || 0, frames: found.frames.map((frame, index) => ({...frame, ms: draft.value.frames?.[index]?.ms || 0}))};
    });
const saveFrames = () => run(() => saveEdit(props.row, chosen.value, draft.value.ms || draft.value.frames.length ? draft.value : null));
const resetFrames = () => run(async () => {
    draft.value = copy(EMPTY);
    await saveEdit(props.row, chosen.value, null);
});
const savePlan = () => run(() => saveSchedule(props.row, plan.value));
const resetPlan = () => run(() => saveSchedule(props.row, null));
const take = (files) => files.length && run(() => dropAnimations(props.row, files));

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
    <Dialog :title="`${row.title} animations`" large @close="$emit('close')">
        <div :class="['editor', {over}]" @dragover.prevent="over = true" @dragleave="over = false" @drop.prevent="dropped">
            <aside class="editor-list">
                <template v-if="rigMoves.length">
                    <h3 class="editor-heading">Moves</h3>
                    <template v-for="each in rigMoves" :key="each.name">
                        <button type="button" :class="['editor-move', {chosen: each.name === moveName}]" @click="(moveName = each.name), (path = '')">
                            {{ each.name }}
                        </button>
                    </template>
                </template>
                <template v-if="!rigMoves.length">
                    <AnimationList :groups="groups" :chosen="path" :schedule="plan" @pick="pick" />
                </template>
                <template v-if="!groups.length">
                    <EmptyState>This voice has no animations yet. Drop sheets or a ZIP here.</EmptyState>
                </template>
            </aside>
            <section class="editor-middle">
                <template v-if="move">
                    <div class="editor-rig">
                        <RigPlayer :voice="voice" :rig="rigged.rig" :move="move" :size="256" loop :paused="!playing" />
                    </div>
                    <div class="editor-controls">
                        <Btn small kind="primary" @click="playing = !playing">{{ playing ? "Pause" : "Play" }}</Btn>
                    </div>
                </template>
                <template v-else-if="chosen">
                    <AnimationStage
                        :url="urlOf(row.n, chosen)"
                        :place="place"
                        :playing="playing"
                        :frame="at"
                        :edit="draft"
                        @frame="at = $event"
                        @measured="count = $event"
                    />
                    <div class="editor-controls">
                        <Btn small kind="primary" @click="playing = !playing">{{ playing ? "Pause" : "Play" }}</Btn>
                        <Btn small :disabled="playing || at < 1" @click="moveTo(at - 1)">Previous frame</Btn>
                        <Btn small :disabled="playing || at >= count - 1" @click="moveTo(at + 1)">Next frame</Btn>
                    </div>
                    <FrameStrip :url="urlOf(row.n, chosen)" :count="count" :current="at" @pick="moveTo" />
                </template>
            </section>
            <aside class="editor-side">
                <template v-if="chosen">
                    <FrameFields :edit="draft" :at="at" :count="count" :locked="playing" @change="draft = $event" />
                    <div class="editor-buttons">
                        <Btn small kind="primary" :disabled="!edited" :busy="busy" @click="saveFrames">Save frames</Btn>
                        <Btn small :disabled="!chosen.edited && !edited" @click="resetFrames">Reset</Btn>
                        <Btn small :busy="busy" @click="anchorFrames">{{ anchoring.sits ? "Anchor the seat" : "Anchor the feet" }}</Btn>
                    </div>
                    <template v-if="anchorNote">
                        <Notice>{{ anchorNote }}</Notice>
                    </template>
                </template>
                <ScheduleFields :schedule="plan" :idle="idle" @change="plan = $event" />
                <div class="editor-buttons">
                    <Btn small kind="primary" :disabled="!planned" :busy="busy" @click="savePlan">Save schedule</Btn>
                    <Btn small @click="resetPlan">Reset</Btn>
                </div>
            </aside>
        </div>
        <template v-if="failed">
            <Notice>{{ failed }}</Notice>
        </template>
        <template #foot>
            <div class="editor-foot">
                <span class="editor-drop">Drop PNG sheets or a ZIP here, named like idle_wave.png, working_left.png or blink.png.</span>
                <input ref="picker" type="file" accept=".png,.zip,image/png,application/zip" multiple hidden @change="picked" />
                <Btn small :busy="busy" @click="picker.click()">Add animations</Btn>
            </div>
        </template>
    </Dialog>
</template>

<style scoped>
.editor {
    display: flex;
    gap: 18px;
    height: 560px;
    border: 1px dashed transparent;
    border-radius: 10px;
}

.editor.over {
    border-color: var(--accent);
    background: color-mix(in srgb, var(--accent) 6%, transparent);
}

.editor-list {
    flex: none;
    width: 200px;
    overflow-y: auto;
}

.editor-middle {
    display: flex;
    flex: 1;
    flex-direction: column;
    gap: 12px;
    min-width: 0;
    overflow-y: auto;
}

.editor-controls,
.editor-buttons {
    display: flex;
    flex-wrap: wrap;
    gap: 6px;
}

.editor-side {
    display: flex;
    flex: none;
    flex-direction: column;
    gap: 14px;
    width: 250px;
    overflow-y: auto;
}

.editor-foot {
    display: flex;
    align-items: center;
    gap: 12px;
    width: 100%;
}

.editor-drop {
    flex: 1;
    color: var(--text-3);
    font-size: 12px;
}

.editor-heading {
    margin: 0 0 6px;
    color: var(--text-3);
    font-size: 11px;
    font-weight: 600;
    text-transform: uppercase;
}

.editor-move {
    display: block;
    width: 100%;
    padding: 8px 10px;
    border: 0;
    border-radius: 6px;
    background: none;
    color: var(--text);
    text-align: left;
    cursor: pointer;
}

.editor-move:hover,
.editor-move.chosen {
    background: color-mix(in srgb, var(--text) 8%, transparent);
}

.editor-move.chosen {
    box-shadow: inset 2px 0 0 var(--accent);
}

.editor-rig {
    display: flex;
    justify-content: center;
    padding: 24px;
    border-radius: 10px;
    background: color-mix(in srgb, var(--text) 4%, transparent);
}
</style>
