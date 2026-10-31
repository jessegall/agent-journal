<script setup>
import {computed, onMounted, onUnmounted, ref} from "vue";
import LayoutPicker from "../agents/LayoutPicker.vue";
import {useLayoutPresets} from "./layoutPresets.js";
import Btn from "../kit/Btn.vue";
import Icon from "../kit/Icon.vue";
import MarkIcon from "../kit/MarkIcon.vue";
import {useTabCounts} from "../composables/tabCounts.js";
import {usePaneActions} from "../composables/paneActions.js";
import DetachedWindows from "../layout/DetachedWindows.vue";
import DragGhost from "../panes/DragGhost.vue";
import DropCompass from "../panes/DropCompass.vue";
import PaneGrid from "../panes/PaneGrid.vue";
import SplitOffer from "../panes/SplitOffer.vue";
import PaneTour from "../panes/PaneTour.vue";
import {usePaneGuide} from "../composables/paneGuide.js";
import {followFullscreen} from "../platform/fullscreen.js";
import {store as shell} from "../state/store.js";
import {leaves} from "../domain/panes.js";
import PaneMenuOptions from "../panes/PaneMenuOptions.vue";
import PaneTabs from "../panes/PaneTabs.vue";
import WindowPane from "./WindowPane.vue";
import PhoneBar from "./PhoneBar.vue";
import PhoneNotify from "./PhoneNotify.vue";
import AgentBar from "../shell/AgentBar.vue";
import InformationBar from "../shell/InformationBar.vue";

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
    face: {type: String, default: "person"},
});

const presets = props.shellRead ? useLayoutPresets({environment: props.environment, page: props.page, shellLine: props.shellRead, catalogue: props.catalogue, store: props.store}) : null;
const agentOf = (name) => (props.catalogue.window(name)?.place === "agent" ? props.agent : null);
const PHONE_WIDTH = 700;
const CHAT_WINDOW = "messages.chat";
const grid = ref(null);
const narrow = ref(window.innerWidth < PHONE_WIDTH);
const width = ref(window.innerWidth);
const measure = () => {
    narrow.value = window.innerWidth < PHONE_WIDTH;
    width.value = window.innerWidth;
};
// the bar shows as many window buttons as fit beside its fixed buttons; the rest fold into a menu, so Presets never leaves the screen
const BUTTON_WIDTH = 124;
const FIXED_WIDTH = 330;
const room = computed(() => Math.max(2, Math.floor((width.value - FIXED_WIDTH) / BUTTON_WIDTH)));
const folded = ref(false);
const agentRow = ref(null);
async function readAgent() {
    const answer = props.shellRead ? await props.shellRead(["agent", "list"]) : null;
    const rows = answer?.ok ? answer.value.rows : [];
    agentRow.value = rows.find((row) => row.role === "main" && !row.ended_at) ?? rows[0] ?? null;
}
const chatFirst = (pane) => (pane.pane.tabs.includes(CHAT_WINDOW) ? 0 : 1);
const phone = computed(() => props.face === "phone");
const phoneNames = computed(() => {
    const layout = props.store.layout.value;
    const names = layout ? leaves(layout.tree).flatMap((id) => layout.panes[id].tabs) : [];
    return [...names.filter((name) => name === CHAT_WINDOW), ...names.filter((name) => name !== CHAT_WINDOW)];
});
const phoneWindows = computed(() => phoneNames.value.map((name) => props.catalogue.window(name) || {name, title: name, icon: "window"}));
const chosen = ref(null);
const picked = computed(() => (phoneNames.value.includes(chosen.value) ? chosen.value : phoneNames.value[0]));
// a row's reference, such as questions:4, names the window that lists its kind, questions.questions
const windowOfRef = (ref) => `${ref.split(":")[0]}.${ref.split(":")[0]}`;
const linkedRef = () => new URLSearchParams(location.hash.slice(1)).get("open");
function openRef(ref) {
    if (phone.value) chosen.value = windowOfRef(ref);
    else openView(windowOfRef(ref));
}
const heardWorker = (event) => event.data?.open && openRef(event.data.open);
onMounted(() => {
    window.addEventListener("resize", measure);
    navigator.serviceWorker?.addEventListener("message", heardWorker);
    presets?.load();
    readAgent();
    if (linkedRef()) openRef(linkedRef());
});
onUnmounted(() => {
    window.removeEventListener("resize", measure);
    navigator.serviceWorker?.removeEventListener("message", heardWorker);
});
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

const guide = usePaneGuide(props.environment, {
    isOpen: () => menu.value !== null,
    open: () => (menu.value = leaves(props.store.layout.value.tree)[0]),
    close: () => (menu.value = null),
});
followFullscreen();
const groups = () => props.catalogue.group(closedWindows.value);
const barWindows = () => groups().flatMap((group) => group.windows);
const declaredBy = (pane) => props.catalogue.window(pane.active)?.options || [];
</script>

<template>
    <div class="pane-stage" @keydown="keyed">
        <template v-if="phone">
            <template v-if="picked">
                <section class="pane phone-pane">
                    <div class="pane-body">
                        <WindowPane
                            :key="picked"
                            :name="picked"
                            :catalogue="catalogue"
                            :subscriptions="subscriptions"
                            :environment="environment"
                            :agent="agentOf(picked)"
                            :visible="true"
                            :prompts="prompts"
                            :shell-read="shellRead"
                        />
                    </div>
                </section>
            </template>
            <PhoneNotify />
            <PhoneBar :windows="phoneWindows" :current="picked" :counts="counts" @pick="(name) => (chosen = name)" />
        </template>
        <template v-else>
            <template v-if="shellRead">
                <AgentBar :agent="agentRow" />
                <InformationBar :agent="agentRow" />
            </template>
            <nav class="pane-stage-bar agent-bar">
                <template v-for="window in barWindows().slice(0, room)" :key="window.name">
                    <Btn
                        small
                        :data-reopen="window.name"
                        :class="{unavailable: window.unavailable_reason}"
                        :title="window.unavailable_reason ? `${window.title}: ${window.unavailable_reason}` : window.title"
                        @pointerdown="!window.unavailable_reason && grabWindow($event, window.name)"
                        @click="!window.unavailable_reason && openView(window.name)"
                    >
                        <MarkIcon :name="window.icon || 'window'" />{{ window.title }}
                    </Btn>
                </template>
                <template v-if="barWindows().length > room">
                    <Btn small data-bar-more aria-label="More windows" @click="folded = !folded">More</Btn>
                    <template v-if="folded">
                        <div class="bar-more" role="menu">
                            <template v-for="window in barWindows().slice(room)" :key="window.name">
                                <Btn small :data-reopen="window.name" :title="window.title" @click="openView(window.name)"><MarkIcon :name="window.icon || 'window'" />{{ window.title }}</Btn>
                            </template>
                        </div>
                    </template>
                </template>
                <span class="agent-bar-space" />
                <Btn kind="icon" data-fullscreen aria-label="Full screen" title="Full screen" @click="shell.wide = !shell.wide">
                    <Icon name="wide" :size="13" />
                </Btn>
                <template v-if="presets">
                    <LayoutPicker :list="presets" />
                </template>
            </nav>
        </template>
        <template v-if="store.layout.value && !phone">
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
                        <Btn kind="icon" class="pane-menu-button" aria-label="Pane menu" @click="toggleMenu(id)">&hellip;</Btn>
                    </PaneTabs>
                    <template v-if="menu === id">
                        <div class="pane-menu" role="menu">
                            <Btn data-menu="split-right" :disabled="pane.tabs.length < 2" @click="split(id, 'right')">Split right</Btn>
                            <Btn data-menu="split-below" :disabled="pane.tabs.length < 2" @click="split(id, 'bottom')">Split below</Btn>
                            <template v-if="floats">
                                <Btn data-menu="detach" @click="detach(id)">Detach</Btn>
                            </template>
                            <PaneMenuOptions :declared="declaredBy(pane)" :values="pane.options || {}" @set="(key, value) => setOption(id, key, value)" />
                            <template v-for="group in catalogue.group()" :key="group.module">
                                <span class="reopen-module" :data-open-module="group.module">{{ group.title }}</span>
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
        <template v-if="floats && !phone">
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
        <template v-if="!phone">
            <PaneTour :tour="guide" />
        </template>
        <template v-if="ghost">
            <DragGhost v-bind="ghost" />
        </template>
    </div>
</template>

<style scoped>
.pane-stage {
    display: flex;
    min-width: 0;
    max-width: 100vw;
    flex: 1;
    flex-direction: column;
    min-height: 0;
}

.agent-bar :deep(button) {
    flex: none;
}

.bar-more {
    position: absolute;
    top: 100%;
    left: 0;
    z-index: 20;
    display: flex;
    flex-direction: column;
    padding: 6px;
    border: 1px solid var(--border-2);
    border-radius: 8px;
    background: var(--bg);
}

.agent-bar-space {
    flex: 1;
}

.pane-stage-bar {
    position: relative;
    display: flex;
    flex: none;
    align-items: center;
    gap: 6px;
    min-width: 0;
    overflow-x: auto;
    padding: 4px 12px;
    border-bottom: 1px solid var(--line);
}

.pane-body {
    position: relative;
    flex: 1;
    min-height: 0;
    overflow: auto;
}

.phone-pane {
    display: flex;
    flex: 1;
    flex-direction: column;
    min-height: 0;
}

.pane-body > :deep(.window) {
    box-sizing: border-box;
    height: 100%;
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
    flex: none;
    white-space: nowrap;
    color: var(--text-3);
    font-size: 11px;
    letter-spacing: 0.04em;
}
</style>
