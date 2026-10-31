<script setup>
import {onMounted, onUnmounted, ref} from "vue";
import LayoutPicker from "../agents/LayoutPicker.vue";
import {useLayoutPresets} from "./layoutPresets.js";
import Btn from "../kit/Btn.vue";
import Icon from "../kit/Icon.vue";
import {useTabCounts} from "../composables/tabCounts.js";
import {usePaneActions} from "../composables/paneActions.js";
import DetachedWindows from "../layout/DetachedWindows.vue";
import DragGhost from "../panes/DragGhost.vue";
import DropCompass from "../panes/DropCompass.vue";
import PaneGrid from "../panes/PaneGrid.vue";
import SplitOffer from "../panes/SplitOffer.vue";
import PaneTour from "../panes/PaneTour.vue";
import {usePaneGuide} from "../composables/paneGuide.js";
import PaneMenuOptions from "../panes/PaneMenuOptions.vue";
import PaneTabs from "../panes/PaneTabs.vue";
import WindowPane from "./WindowPane.vue";

const props = defineProps({
    store: {type: Object, required: true},
    catalogue: {type: Object, required: true},
    subscriptions: {type: Object, required: true},
    environment: {type: String, required: true},
    agent: {type: Number, default: null},
    page: {type: String, default: "home"},
    floats: {type: Boolean, default: true},
    prompts: {type: Object, default: null},
    shellRead: {type: Function, default: null},
});

const presets = props.shellRead ? useLayoutPresets({environment: props.environment, page: props.page, shellLine: props.shellRead, catalogue: props.catalogue, store: props.store}) : null;
const guide = usePaneGuide(props.environment);
const agentOf = (name) => (props.catalogue.window(name)?.place === "agent" ? props.agent : null);
const PHONE_WIDTH = 700;
const CHAT_WINDOW = "messages.chat";
const grid = ref(null);
const narrow = ref(window.innerWidth < PHONE_WIDTH);
const measure = () => (narrow.value = window.innerWidth < PHONE_WIDTH);
const chatFirst = (pane) => (pane.pane.tabs.includes(CHAT_WINDOW) ? 0 : 1);
onMounted(() => {
    window.addEventListener("resize", measure);
    presets?.load();
});
onUnmounted(() => window.removeEventListener("resize", measure));
const {counts} = useTabCounts({
    catalogue: props.catalogue,
    subscriptions: props.subscriptions,
    environment: props.environment,
    names: () => (props.store.layout.value ? [...props.store.open.value] : []),
});
const {detached, detach, setOption, full, menu, keyed, toggleMenu, split, moveTo, others, aimed, ghost, grabTab, pick, closeTab, tabsOf, closedWindows, openView, grabWindow, offer, offerText, answer} = usePaneActions({
    store: props.store,
    area: grid,
    catalogue: props.catalogue,
    counts,
    environment: props.environment,
});

const groups = () => props.catalogue.group(closedWindows.value);
const declaredBy = (pane) => props.catalogue.window(pane.active)?.options || [];
</script>

<template>
    <div class="pane-stage" @keydown="keyed">
        <nav class="pane-stage-bar agent-bar">
            <template v-for="group in groups()" :key="group.module">
                <span class="reopen-module">{{ group.module }}</span>
                <template v-for="window in group.windows" :key="window.name">
                    <Btn
                        :data-reopen="window.name"
                        :class="{unavailable: window.unavailable_reason}"
                        :title="window.unavailable_reason ? `${window.title}: ${window.unavailable_reason}` : window.title"
                        @pointerdown="!window.unavailable_reason && grabWindow($event, window.name)"
                        @click="!window.unavailable_reason && openView(window.name)"
                    >
                        <Icon :name="window.icon || 'window'" :size="13" />
                    </Btn>
                </template>
            </template>
            <span class="agent-bar-space" />
            <template v-if="presets">
                <LayoutPicker :list="presets" />
            </template>
        </nav>
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
                            <template v-if="floats">
                                <Btn data-menu="detach" @click="detach(id)">Detach</Btn>
                            </template>
                            <PaneMenuOptions :declared="declaredBy(pane)" :values="pane.options || {}" @set="(key, value) => setOption(id, key, value)" />
                            <template v-for="group in catalogue.group()" :key="group.module">
                                <span class="reopen-module" :data-open-module="group.module">{{ group.module }}</span>
                                <template v-for="window in group.windows" :key="window.name">
                                    <Btn :data-open="window.name" :disabled="Boolean(window.unavailable_reason)" @click="openView(window.name)">{{ window.title }}</Btn>
                                </template>
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
                                :agent="agentOf(pane.active)"
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
        <template v-if="floats">
            <DetachedWindows
                :detached="detached"
                :catalogue="catalogue"
                :subscriptions="subscriptions"
                :environment="environment"
                :agent="agent"
                :prompts="prompts"
                :shell-read="shellRead"
            />
        </template>
        <PaneTour :tour="guide" />
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

.agent-bar-space {
    flex: 1;
}

.pane-stage-bar {
    display: flex;
    align-items: center;
    gap: 6px;
    padding: 4px 12px;
    border-bottom: 1px solid var(--line);
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

.agent-bar .unavailable {
    opacity: 0.45;
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
