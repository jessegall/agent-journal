<script setup>
import {computed, ref} from "vue";
import Icon from "../kit/Icon.vue";
import ChoiceList from "../kit/ChoiceList.vue";
import MenuItem from "../kit/MenuItem.vue";
import MenuLabel from "../kit/MenuLabel.vue";
import MenuPanel from "../kit/MenuPanel.vue";
import SwitchCase from "../kit/SwitchCase.vue";
import ToggleItem from "../kit/ToggleItem.vue";
import {shownChoices, toggled} from "../domain/chatShown.js";
import {agentView, resetAgentView} from "../composables/agentsShown.js";
import {KIND_SWITCHES, ORDERS, STATE_SWITCHES} from "../domain/orchestra.js";
import {useOutside} from "../composables/outside.js";
import {go, route} from "../route.js";

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
const choices = computed(() => shownChoices(props.hidden));
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
                <MenuItem class="pane-menu-back" @click="list = ''">
                    <Icon name="back" :size="14" />
                    Move {{ title }} to
                </MenuItem>
                <template v-for="o in others" :key="o.id">
                    <MenuItem @click="pick('move', o.id)">
                        <Icon :name="o.icon" :size="14" />
                        {{ o.label }}
                    </MenuItem>
                </template>
            </template>
            <template #levels>
                <MenuItem class="pane-menu-back" @click="list = ''">
                    <Icon name="back" :size="14" />
                    Verbosity
                </MenuItem>
                <template v-for="l in levels" :key="l.value">
                    <MenuItem :aria-current="l.current" @click="pick('verbosity', l.value)">
                        <Icon :name="l.icon" :size="14" />
                        {{ l.label }}
                        <template v-if="l.current">
                            <span class="pane-menu-dot" />
                        </template>
                    </MenuItem>
                </template>
            </template>
            <template #agentView>
                <MenuItem class="pane-menu-back" @click="list = ''">
                    <Icon name="back" :size="14" />
                    View
                </MenuItem>
                <MenuLabel>Show agents that are</MenuLabel>
                <template v-for="s in STATE_SWITCHES" :key="s.key">
                    <ToggleItem
                        :class="{'pane-menu-off': !agentView.states[s.key]}"
                        :on="agentView.states[s.key]"
                        :icon="s.icon"
                        @click="agentView.states[s.key] = !agentView.states[s.key]"
                    >
                        {{ s.label }}
                    </ToggleItem>
                </template>
                <MenuLabel>Working for</MenuLabel>
                <template v-for="s in KIND_SWITCHES" :key="s.key">
                    <ToggleItem
                        :class="{'pane-menu-off': !agentView.kinds[s.key]}"
                        :on="agentView.kinds[s.key]"
                        :icon="s.icon"
                        @click="agentView.kinds[s.key] = !agentView.kinds[s.key]"
                    >
                        {{ s.label }}
                    </ToggleItem>
                </template>
                <ToggleItem :on="agentView.unfinished" icon="flag" @click="agentView.unfinished = !agentView.unfinished">
                    Only with an unfinished plan
                </ToggleItem>
                <MenuLabel>Order</MenuLabel>
                <template v-for="o in ORDERS" :key="o.key">
                    <MenuItem :aria-current="agentView.order === o.key" @click="agentView.order = o.key">
                        <Icon :name="o.icon" :size="14" />
                        {{ o.label }}
                        <template v-if="agentView.order === o.key">
                            <span class="pane-menu-dot" />
                        </template>
                    </MenuItem>
                </template>
                <span class="pane-menu-line" />
                <MenuItem @click="resetAgentView">
                    <Icon name="restore" :size="14" />
                    Show every agent
                </MenuItem>
            </template>
            <template #shown>
                <MenuItem class="pane-menu-back" @click="list = ''">
                    <Icon name="back" :size="14" />
                    Show in chat
                </MenuItem>
                <template v-for="group in choices" :key="group.title">
                    <MenuLabel>{{ group.title }}</MenuLabel>
                    <template v-for="kind in group.kinds" :key="kind.key">
                        <ToggleItem
                            :class="{'pane-menu-off': !kind.on}"
                            :on="kind.on"
                            :icon="kind.icon"
                            @click="hide(toggled(hidden, kind.key))"
                        >
                            {{ kind.label }}
                        </ToggleItem>
                    </template>
                </template>
                <span class="pane-menu-line" />
                <MenuItem :disabled="!hidden.length" @click="hide([])">
                    <Icon name="restore" :size="14" />
                    Show everything
                </MenuItem>
            </template>
            <template #schemes>
                <MenuItem class="pane-menu-back" @click="list = ''">
                    <Icon name="back" :size="14" />
                    Colour scheme
                </MenuItem>
                <ChoiceList :choices="schemes" @pick="(key) => pick('scheme', key)" />
            </template>
            <template #floating>
                <MenuItem @click="pick('dock')">
                    <Icon name="dock" :size="14" />
                    Dock
                </MenuItem>
                <MenuItem @click="pick('away')">
                    <Icon name="open" :size="14" />
                    Open in another tab
                </MenuItem>
                <span class="pane-menu-line" />
                <MenuItem @click="pick('unfloat')">
                    <Icon name="x" :size="14" />
                    Close window
                </MenuItem>
            </template>
            <template #default>
                <MenuItem data-step="split" :disabled="!splittable" @click="pick('split', 'right')">
                    <Icon name="columns" :size="14" />
                    Split right
                </MenuItem>
                <MenuItem data-step="split" :disabled="!splittable" @click="pick('split', 'bottom')">
                    <Icon name="rows" :size="14" />
                    Split below
                </MenuItem>
                <MenuItem @click="pick('width', width === 'contained' ? 'full' : 'contained')">
                    <Icon :name="width === 'contained' ? 'wide' : 'narrow'" :size="14" />
                    {{ width === "contained" ? "Fill" : "Contain" }}
                </MenuItem>
                <MenuItem :disabled="!others.length || !title" @click="list = 'move'">
                    <Icon name="arrow" :size="14" />
                    Move to…
                    <span class="pane-menu-more">›</span>
                </MenuItem>
                <template v-if="floats">
                    <MenuItem data-step="detach" :disabled="!title" @click="pick('float')">
                        <Icon name="float" :size="14" />
                        Detach
                    </MenuItem>
                </template>
                <span class="pane-menu-line" />
                <MenuItem :disabled="!closable" @click="pick('shut')">
                    <Icon name="x" :size="14" />
                    Close
                </MenuItem>
                <MenuItem @click="pick('reset')">
                    <Icon name="restore" :size="14" />
                    Reset layout
                </MenuItem>
            </template>
        </SwitchCase>
        <template v-if="!list && (all || schemes.length || flushable || levels.length || chat || agents)">
            <span class="pane-menu-line" />
            <template v-if="flushable">
                <MenuItem @click="pick('flush', !flush)">
                    <Icon :name="flush ? 'narrow' : 'wide'" :size="14" />
                    {{ flush ? "Inset" : "Flush" }}
                </MenuItem>
            </template>
            <template v-if="levels.length">
                <MenuItem @click="list = 'levels'">
                    <Icon name="list" :size="14" />
                    Verbosity
                    <span class="pane-menu-more">›</span>
                </MenuItem>
            </template>
            <template v-if="agents">
                <MenuItem @click="list = 'agentView'">
                    <Icon name="eye" :size="14" />
                    View
                    <span class="pane-menu-more">›</span>
                </MenuItem>
            </template>
            <template v-if="chat">
                <MenuItem @click="list = 'shown'">
                    <Icon name="eye" :size="14" />
                    Show in chat
                    <template v-if="hidden.length">
                        <span class="pane-menu-note">{{ hidden.length }} hidden</span>
                    </template>
                    <span :class="['pane-menu-more', {near: hidden.length}]">›</span>
                </MenuItem>
            </template>
            <template v-if="schemes.length">
                <MenuItem @click="list = 'schemes'">
                    <Icon name="palette" :size="14" />
                    Colour scheme
                    <span class="pane-menu-more">›</span>
                </MenuItem>
            </template>
            <template v-if="all">
                <MenuItem @click="openAll">
                    <Icon name="open" :size="14" />
                    {{ all.label }}
                </MenuItem>
            </template>
        </template>
    </MenuPanel>
</template>

<style scoped>
.pane-menu-more {
    margin-left: auto;
    color: var(--text-4);
}

.pane-menu-more.near {
    margin-left: 6px;
}

.pane-menu-note {
    margin-left: auto;
    color: var(--text-4);
    font-size: 11px;
    font-variant-numeric: tabular-nums;
}

.menu-item.pane-menu-off {
    color: var(--text-4);
}

.pane-menu-dot {
    flex: none;
    width: 6px;
    height: 6px;
    margin-left: auto;
    border-radius: 50%;
    background: var(--text-2);
}

.pane-menu-back {
    color: var(--text-3);
}

.pane-menu-line {
    height: 1px;
    margin: 4px 2px;
    background: var(--border);
}
</style>
