<script setup>
import {computed, ref} from "vue";
import ChoiceList from "../kit/ChoiceList.vue";
import MenuPanel from "../kit/MenuPanel.vue";
import SwitchCase from "../kit/SwitchCase.vue";
import {useOutside} from "../composables/outside.js";
import {go, route} from "../route.js";
import PaneMenuAgentView from "./PaneMenuAgentView.vue";
import PaneMenuBack from "./PaneMenuBack.vue";
import PaneMenuExtras from "./PaneMenuExtras.vue";
import PaneMenuFloating from "./PaneMenuFloating.vue";
import PaneMenuLevels from "./PaneMenuLevels.vue";
import PaneMenuMove from "./PaneMenuMove.vue";
import PaneMenuPane from "./PaneMenuPane.vue";
import PaneMenuVisible from "./PaneMenuVisible.vue";

const props = defineProps({
    pane: {type: Number, required: true},
    anchor: {type: Object, default: null},
    title: {type: String, default: ""},
    others: {type: Array, default: () => []},
    splittable: Boolean,
    closable: Boolean,
    floating: Boolean,
    all: {type: Object, default: null},
    width: {type: String, default: ""},
    schemes: {type: Array, default: () => []},
    levels: {type: Array, default: () => []},
    flushable: Boolean,
    flush: Boolean,
    chat: Boolean,
    agents: Boolean,
    floats: {type: Boolean, default: true},
    hidden: {type: Array, default: () => []},
});
const emit = defineEmits([
    "close",
    "split",
    "move",
    "float",
    "shut",
    "reset",
    "dock",
    "away",
    "unfloat",
    "width",
    "scheme",
    "flush",
    "verbosity",
    "hide",
]);
const menu = ref(null);
const list = ref("");
const mode = computed(() => list.value || (props.floating ? "floating" : "pane"));
useOutside(menu, () => emit("close"));

const hide = (list) => emit("hide", props.pane, list);

function openAll() {
    emit("close");
    go(route.value.env, props.all.page);
}

function pick(event, ...args) {
    const pane = props.pane;
    emit("close");
    emit(event, pane, ...args);
}
</script>

<template>
    <MenuPanel ref="menu" :anchor="anchor" :min-width="200" :max-width="280" @click.stop @close="emit('close')">
        <SwitchCase :value="mode">
            <template #move>
                <PaneMenuMove :title="title" :others="others" @back="list = ''" @pick="pick" />
            </template>
            <template #levels>
                <PaneMenuLevels :levels="levels" @back="list = ''" @pick="pick" />
            </template>
            <template #agentView>
                <PaneMenuAgentView @back="list = ''" />
            </template>
            <template #visible>
                <PaneMenuVisible :hidden="hidden" @back="list = ''" @hide="hide" />
            </template>
            <template #schemes>
                <PaneMenuBack @click="list = ''">Color scheme</PaneMenuBack>
                <ChoiceList :choices="schemes" @pick="(key) => pick('scheme', key)" />
            </template>
            <template #floating>
                <PaneMenuFloating @pick="pick" />
            </template>
            <template #default>
                <PaneMenuPane
                    :title="title"
                    :others="others"
                    :splittable="splittable"
                    :closable="closable"
                    :width="width"
                    :floats="floats"
                    @pick="pick"
                    @open="(name) => (list = name)"
                />
            </template>
        </SwitchCase>
        <template v-if="!list && (all || schemes.length || flushable || levels.length || chat || agents)">
            <PaneMenuExtras
                :all="all"
                :schemes="schemes"
                :levels="levels"
                :flushable="flushable"
                :flush="flush"
                :chat="chat"
                :agents="agents"
                :hidden="hidden"
                @pick="pick"
                @open="(name) => (list = name)"
                @all="openAll"
            />
        </template>
    </MenuPanel>
</template>
