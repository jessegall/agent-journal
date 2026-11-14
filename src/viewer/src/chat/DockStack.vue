<script setup>
import {computed, inject, ref, watch} from "vue";
import {useNow} from "../composables/now.js";
import {WINDOW_CONTEXT} from "../windows/windowContext.js";
import {pressButton} from "./markButtons.js";
import {DOCK_ARRIVAL_MS} from "../kit/ChatDock.vue";
import Btn from "../kit/Btn.vue";
import FoldSign from "../kit/FoldSign.vue";
import DockWrapper from "./DockWrapper.vue";
import {dockDeclaration} from "../domain/dockRegistry.js";
import {dockFolded} from "../domain/dockFold.js";
import {dockedItems, isLeaving, isRunItem, keptRuns} from "../domain/dockItems.js";
import {store} from "../state/store.js";
import {rememberedRef} from "../windows/rememberedState.js";

// the items docked at the bottom of the chat, above the composer: a card eases in when it docks and out when it leaves (kit/ChatDock.vue), a leaving item runs a countdown down its top edge, pointing at it holds it,
// and every run docks as a card of its own
const props = defineProps({items: {type: Array, required: true}, folded: Boolean, collapsed: Boolean, insidesFolded: Boolean});
const now = useNow(500);
const held = ref(new Set());

const context = inject(WINDOW_CONTEXT);
// a card leaves the moment its close is pressed, and comes back with the reason if the server refuses
const closed = ref(new Set());
const refusals = ref({});

async function undock(item, button) {
    refusals.value = {...refusals.value, [item.id]: ""};
    closed.value = new Set([...closed.value, item.id]);
    const answer = await pressButton(button, {id: item.target_id}, context.environment);
    if (answer?.ok !== false) return;
    closed.value = new Set([...closed.value].filter((id) => id !== item.id));
    refusals.value = {...refusals.value, [item.id]: `Could not dismiss this card: ${answer.error}`};
}

const docked = computed(() =>
    dockedItems(
        props.items.filter((item) => !closed.value.has(item.id)),
        now.value,
        held.value
    )
);
const runs = computed(() =>
    keptRuns(
        docked.value.filter((item) => isRunItem(item, dockDeclaration)),
        now.value
    )
);
const rows = computed(() => docked.value.filter((item) => !runs.value.includes(item) && !isRunItem(item, dockDeclaration)));
const sizeChoice = rememberedRef(`dock-size:${store.identity?.root || location.host}`, null);
const waitsOnPerson = (item) => Boolean(dockDeclaration(item.type)?.needs_user);
// a card that waits on the user, or the only card in the dock, docks open whatever the chat's scroll or the others' size choice says, until the user folds it
const handFolded = ref(new Set());
const scrollFolded = ref(new Set());
const alone = computed(() => docked.value.length === 1);
const opensUnfolded = (item) => waitsOnPerson(item) || alone.value;
const collapsedFor = (item) => opensUnfolded(item) ? handFolded.value.has(item.id) || scrollFolded.value.has(item.id) : sizeChoice.value ? sizeChoice.value.collapsed && !sizeChoice.value.opened.includes(item.id) : props.collapsed;
const anyCollapsed = computed(() => docked.value.some(collapsedFor));

watch(() => props.collapsed, (collapsed) => {
    scrollFolded.value = new Set(collapsed ? docked.value.filter(waitsOnPerson).map((item) => item.id) : []);
});

function changeAll() {
    const folding = !anyCollapsed.value;
    sizeChoice.value = {collapsed: folding, opened: []};
    handFolded.value = new Set(folding ? docked.value.filter(waitsOnPerson).map((item) => item.id) : []);
    scrollFolded.value = new Set();
}

function openCard(item) {
    if (!collapsedFor(item)) return;
    if (opensUnfolded(item)) {
        handFolded.value = new Set([...handFolded.value].filter((id) => id !== item.id));
        scrollFolded.value = new Set([...scrollFolded.value].filter((id) => id !== item.id));
        return;
    }
    const opened = sizeChoice.value?.collapsed ? sizeChoice.value.opened : [];
    sizeChoice.value = {collapsed: true, opened: [...opened, item.id]};
}

// a card the user folded or unfolded by hand keeps that, the rest follow the chat's scroll; while the chat is scrolled up the insides of every card fold, and the
// hand's choice, which is not touched, shows again at the foot
const byHand = rememberedRef(`dock-folded:${store.identity?.root || location.host}`, {});
const foldedFor = (item) =>
    Boolean(dockDeclaration(item.type)?.folds) && (props.insidesFolded || dockFolded(byHand.value[item.id], isRunItem(item, dockDeclaration) || props.folded));
function fold(item) {
    if (foldedFor(item)) keepOpen(item);
    byHand.value = {...byHand.value, [item.id]: !foldedFor(item)};
}

// a card whose output the user opened stays open when the others are folded, as one opened by a click does, so a card docking beside it does not fold it
function keepOpen(item) {
    if (!sizeChoice.value?.collapsed || sizeChoice.value.opened.includes(item.id)) return;
    sizeChoice.value = {collapsed: true, opened: [...sizeChoice.value.opened, item.id]};
}

function hold(item) {
    held.value = new Set([...held.value, item.id]);
}

function release(item) {
    held.value = new Set([...held.value].filter((id) => id !== item.id));
}
</script>

<template>
    <TransitionGroup tag="div" name="dock" :duration="DOCK_ARRIVAL_MS" class="dock-stack">
        <div v-if="docked.length > 1" key="dock-all" class="dock-all">
            <Btn small bordered data-dock-all :aria-label="anyCollapsed ? 'Open all' : 'Collapse all'" @click="changeAll"><FoldSign :open="!anyCollapsed" /></Btn>
        </div>
        <template v-for="item in rows" :key="item.id">
            <DockWrapper
                :item="item"
                :class="{timed: isLeaving(item)}"
                :leaving="isLeaving(item) && !held.has(item.id)"
                :folded="foldedFor(item)"
                :collapsed="collapsedFor(item)"
                :refusal="refusals[item.id]"
                @open="openCard(item)"
                @fold="fold(item)"
                @undock="undock(item, $event)"
                @mouseenter="hold(item)"
                @mouseleave="release(item)"
            />
        </template>
        <template v-for="item in runs" :key="item.id">
            <DockWrapper
                :item="item"
                :class="{timed: isLeaving(item)}"
                :leaving="isLeaving(item) && !held.has(item.id)"
                :folded="foldedFor(item)"
                :collapsed="collapsedFor(item)"
                :refusal="refusals[item.id]"
                @open="openCard(item)"
                @fold="fold(item)"
                @undock="undock(item, $event)"
                @mouseenter="hold(item)"
                @mouseleave="release(item)"
            />
        </template>
    </TransitionGroup>
</template>

<style scoped>
.dock-all {
    display: flex;
    justify-content: flex-end;
    align-items: center;
    min-height: 28px;
    padding: 0 4px;
    background: var(--raised);
    /* the header stays at the top of the chat's foot while the cards scroll under it */
    position: sticky;
    top: 0;
    z-index: 2;
}

.dock-all :deep([data-dock-all]) {
    border: 0;
    background: none;
}

.dock-stack {
    display: flex;
    flex-direction: column;
    /* clip, not hidden: hidden would make the stack a scroll container and the sticky header would never stick */
    overflow: clip;
    border: 1px solid var(--border);
    border-radius: 10px;
    background: var(--raised);
}

.dock-stack:empty {
    border: none;
}

.dock-stack > :first-child,
.dock-stack > :first-child :deep(.chat-dock-card) {
    border-top: none;
}

</style>
