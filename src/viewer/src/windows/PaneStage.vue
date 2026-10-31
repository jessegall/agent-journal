<script setup>
import {onMounted, onUnmounted, ref} from "vue";
import Btn from "../kit/Btn.vue";
import {useTabCounts} from "../composables/tabCounts.js";
import {usePaneActions} from "../composables/paneActions.js";
import DragGhost from "../panes/DragGhost.vue";
import DropCompass from "../panes/DropCompass.vue";
import PaneGrid from "../panes/PaneGrid.vue";
import SplitOffer from "../panes/SplitOffer.vue";
import PaneTabs from "../panes/PaneTabs.vue";
import WindowPane from "./WindowPane.vue";

const props = defineProps({
    store: {type: Object, required: true},
    catalogue: {type: Object, required: true},
    subscriptions: {type: Object, required: true},
    environment: {type: String, required: true},
    agent: {type: Number, default: null},
    prompts: {type: Object, default: null},
    shellRead: {type: Function, default: null},
});

const PHONE_WIDTH = 700;
const CHAT_WINDOW = "messages.chat";
const grid = ref(null);
const narrow = ref(window.innerWidth < PHONE_WIDTH);
const measure = () => (narrow.value = window.innerWidth < PHONE_WIDTH);
const chatFirst = (pane) => (pane.pane.tabs.includes(CHAT_WINDOW) ? 0 : 1);
onMounted(() => window.addEventListener("resize", measure));
onUnmounted(() => window.removeEventListener("resize", measure));
const {counts} = useTabCounts({
    catalogue: props.catalogue,
    subscriptions: props.subscriptions,
    environment: props.environment,
    names: () => (props.store.layout.value ? [...props.store.open.value] : []),
});
const {full, menu, keyed, toggleMenu, split, moveTo, others, aimed, ghost, grabTab, pick, closeTab, tabsOf, closedWindows, openView, grabWindow, offer, offerText, answer} = usePaneActions({
    store: props.store,
    area: grid,
    catalogue: props.catalogue,
    counts,
});

const modules = () => [...new Set(closedWindows.value.map((window) => window.module))];
const ofModule = (module) => closedWindows.value.filter((window) => window.module === module);
</script>

<template>
    <div class="pane-stage" @keydown="keyed">
        <template v-if="store.layout.value">
            <PaneGrid ref="grid" :full="full" :stacked="narrow" :rank="chatFirst" :panes="store.panes.value" :splits="store.measured.value.splits" @resize="store.resize">
                <template #pane="{id, pane, state}">
                    <PaneTabs
                        :tabs="tabsOf(id, pane)"
                        :data-tabs-of="id"
                        :insert-at="aimed?.zone === 'tabs' && aimed.id === id ? aimed.index : -1"
                        @grab="(event, key) => grabTab(event, id, key)"
                        @pick="(key) => pick(id, key)"
                        @close="(key) => closeTab(id, key)"
                    >
                        <Btn class="pane-menu-button" aria-label="Pane menu" @click="toggleMenu(id)">&hellip;</Btn>
                    </PaneTabs>
                    <template v-if="menu === id">
                        <div class="pane-menu" role="menu">
                            <template v-if="pane.tabs.length > 1">
                                <Btn data-menu="split-right" @click="split(id, 'right')">Split right</Btn>
                                <Btn data-menu="split-below" @click="split(id, 'bottom')">Split below</Btn>
                            </template>
                            <template v-for="other in others(id)" :key="other.id">
                                <Btn :data-menu="`move-${other.id}`" @click="moveTo(id, other.id)">Move to {{ other.title }}</Btn>
                            </template>
                        </div>
                    </template>
                    <div class="pane-body">
                        <template v-if="pane.active">
                            <WindowPane
                                :key="pane.active"
                                :name="pane.active"
                                :catalogue="catalogue"
                                :subscriptions="subscriptions"
                                :environment="environment"
                                :agent="agent"
                                :visible="state === 'live'"
                                :prompts="prompts"
                                :shell-read="shellRead"
                                @remove="closeTab(id, pane.active)"
                            />
                        </template>
                        <template v-else>
                            <p class="pane-empty">Nothing is open in this pane.</p>
                        </template>
                    </div>
                    <template v-if="offer?.id === id">
                        <SplitOffer :text="offerText" @pick="answer" />
                    </template>
                    <template v-if="aimed?.id === id && aimed.zone !== 'tabs' && state === 'live'">
                        <DropCompass :zone="aimed.zone" />
                    </template>
                </template>
            </PaneGrid>
        </template>
        <template v-if="closedWindows.length">
            <nav class="reopen-bar" aria-label="Closed windows">
                <template v-for="module in modules()" :key="module">
                    <span class="reopen-module">{{ module }}</span>
                    <template v-for="window in ofModule(module)" :key="window.name">
                        <Btn :data-reopen="window.name" @pointerdown="grabWindow($event, window.name)" @click="openView(window.name)">{{ window.title }}</Btn>
                    </template>
                </template>
            </nav>
        </template>
        <template v-if="ghost">
            <DragGhost v-bind="ghost" />
        </template>
    </div>
</template>

<style scoped>
.pane-stage {
    display: flex;
    flex: 1;
    flex-direction: column;
    min-height: 0;
}

.pane-body {
    position: relative;
    flex: 1;
    min-height: 0;
    overflow: auto;
}

.pane-body > :deep(.window) {
    padding: 16px;
}

.pane-menu {
    position: absolute;
    top: 34px;
    right: 5px;
    z-index: 6;
    display: flex;
    flex-direction: column;
    gap: 4px;
    padding: 6px;
    border: 1px solid var(--line);
    border-radius: 6px;
    background: var(--bg);
}

.pane-empty {
    padding: 16px;
    color: var(--text-3);
}

.reopen-bar {
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    gap: 8px;
    padding: 8px 16px;
    border-top: 1px solid var(--line);
}

.reopen-module {
    color: var(--text-3);
    font-size: 11px;
    letter-spacing: 0.04em;
}
</style>
