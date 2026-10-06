<script setup>
import {computed, ref} from "vue";
import Btn from "../kit/Btn.vue";
import Byline from "../kit/Byline.vue";
import CloseButton from "../kit/CloseButton.vue";
import Icon from "../kit/Icon.vue";
import MenuItem from "../kit/MenuItem.vue";
import MenuPanel from "../kit/MenuPanel.vue";
import StateDot from "../kit/StateDot.vue";
import {narrow} from "../platform/view.js";

const props = defineProps({info: {type: Object, required: true}, asking: {type: String, default: ""}});
const emit = defineEmits(["action", "back", "close"]);

const menu = ref(false);
const opener = ref(null);
const state = computed(() => props.info.state);
const model = computed(() => props.info.facts[0] || props.info.name);
const rest = computed(() => props.info.facts.slice(1).join(" · "));

function pick(key) {
    menu.value = false;
    emit("action", key);
}
</script>

<template>
    <header class="inspector-head">
        <template v-if="info.back">
            <Btn kind="text" class="inspector-back" @click="emit('back')">
                <Icon name="back" :size="13" />
                {{ info.back }}
            </Btn>
        </template>
        <div class="inspector-line">
            <span class="inspector-kind">{{ info.kind }}</span>
            <strong class="inspector-name">{{ info.name }}</strong>
            <StateDot :state="state.dot" />
            <span :class="['inspector-state', state.key]">{{ state.word }}</span>
            <span class="inspector-grow" />
            <div class="inspector-tools">
                <template v-if="!narrow">
                    <slot name="tools" />
                </template>
                <template v-if="narrow">
                    <span ref="opener">
                        <Btn kind="icon" small title="Actions" @click.stop="menu = !menu">
                            <Icon name="dots" :size="14" />
                        </Btn>
                    </span>
                </template>
                <template v-else>
                    <template v-for="action in info.actions" :key="action.key">
                        <Btn
                            small
                            :kind="action.danger ? 'danger' : 'ghost'"
                            :disabled="asking === action.key"
                            :title="action.title"
                            @click="emit('action', action.key)"
                        >
                            {{ action.label }}
                        </Btn>
                    </template>
                </template>
                <CloseButton title="Close the inspector" @click="emit('close')" />
            </div>
        </div>
        <template v-if="menu">
            <MenuPanel :anchor="opener" align="right" :min-width="260" @click.stop @close="menu = false">
                <slot name="menu" />
                <template v-for="action in info.actions" :key="action.key">
                    <MenuItem :description="action.title" @click="pick(action.key)">{{ action.label }}</MenuItem>
                </template>
            </MenuPanel>
        </template>
        <h2 class="inspector-title">{{ info.title }}</h2>
        <Byline small side="agent" :name="model" :when="rest">
            <slot name="facts" />
        </Byline>
    </header>
</template>

<style scoped>
.inspector-head {
    display: flex;
    flex: none;
    flex-direction: column;
    gap: 6px;
    padding: 12px 16px 10px;
    border-bottom: 1px solid var(--border);
}

.inspector-back {
    align-self: flex-start;
    color: var(--accent-text);
    font-size: 12.5px;
}

.inspector-line {
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    gap: 6px 8px;
    min-width: 0;
}

.inspector-kind {
    white-space: nowrap;
    color: var(--text-3);
    font-size: 11px;
    font-weight: 600;
    letter-spacing: 0.05em;
    text-transform: uppercase;
}

.inspector-name {
    min-width: 0;
    overflow: hidden;
    color: var(--text);
    font-size: 13px;
    text-overflow: ellipsis;
    white-space: nowrap;
}

.inspector-state {
    color: var(--text-2);
    font-size: 12.5px;
}

.inspector-state.waiting,
.inspector-state.paused {
    color: var(--tone-commit);
}

.inspector-state.stuck {
    color: var(--danger);
}

.inspector-grow {
    flex: 1;
}

.inspector-tools {
    display: flex;
    flex: none;
    align-items: center;
    gap: 6px;
}

.inspector-head :deep(.byline) {
    flex-wrap: wrap;
}

.inspector-head :deep(.name) {
    white-space: nowrap;
}

.inspector-title {
    margin: 0;
    overflow: hidden;
    color: var(--text);
    font-size: 17px;
    font-weight: 600;
    line-height: 1.3;
}

@media (max-width: 600px) {
    .inspector-title {
        font-size: 15px;
    }

    .inspector-tools {
        margin-left: auto;
    }
}
</style>
