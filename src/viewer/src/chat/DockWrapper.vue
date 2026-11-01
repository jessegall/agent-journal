<script setup>
import {computed} from "vue";
import Btn from "../kit/Btn.vue";
import ChatDock from "../kit/ChatDock.vue";
import CloseButton from "../kit/CloseButton.vue";
import DockLeave from "./DockLeave.vue";
import FoldSign from "../kit/FoldSign.vue";
import Icon from "../kit/Icon.vue";
import MarkBody from "./MarkBody.vue";
import {api} from "../api/client.js";
import {dockDeclaration} from "../domain/dockRegistry.js";
import {dockLook} from "../domain/dockLook.js";
import {pressButton} from "./markButtons.js";
import {peekRef} from "../route.js";

// one item docked above the chat, drawn as version 4 drew a docked card: the type's icon and title, its buttons, and the body its module gives it
const emit = defineEmits(["fold"]);
const props = defineProps({item: {type: Object, required: true}, folded: Boolean, leaving: Boolean});
const declaration = computed(() => dockDeclaration(props.item.type));
const look = computed(() => dockLook(props.item, declaration.value));
const press = (button) => (button.action === "open" ? peekRef(`${props.item.target_model}:${props.item.target_id}`) : pressButton(button, props.item, api.env()));
const buttons = computed(() => look.value.buttons.filter((button) => button.action !== "undock"));
const undock = computed(() => look.value.buttons.find((button) => button.action === "undock"));
</script>

<template>
    <ChatDock :label="look.title" :folded="folded">
        <template #edge>
            <template v-if="leaving">
                <DockLeave :ends-at="item.leaves_at" />
            </template>
        </template>
        <template #head>
            <Icon :name="look.icon" class="dock-icon" />
            <span class="dock-title">{{ look.title }}</span>
            <template v-if="declaration?.badge">
                <span :class="['dock-badge', item.type.split('.')[1]]" data-dock-badge>{{ declaration.badge }}</span>
            </template>
            <button type="button" class="dock-fold" data-dock-fold :aria-expanded="!folded" :title="folded ? 'Unfold' : 'Fold'" @click="emit('fold')"><FoldSign :open="!folded" /></button>
            <span class="chat-dock-acts dock-acts">
                <template v-for="button in buttons" :key="button.action + button.runs">
                    <Btn small bordered :data-dock-action="button.action" @click="press(button)">{{ button.label }}</Btn>
                </template>
            </span>
            <CloseButton :title="undock.label" data-dock-action="undock" @click="press(undock)" />
        </template>
        <template v-if="item.text && !declaration?.body_url">
            <p class="dock-text">{{ item.text }}</p>
        </template>
        <template v-if="declaration?.body_url">
            <MarkBody :declaration="declaration" :mark="item" shown />
        </template>
    </ChatDock>
</template>

<style scoped>
.dock-icon {
    flex: none;
    color: var(--text-3);
}

.dock-badge {
    flex: none;
    padding: 1px 8px;
    border-radius: 9px;
    background: var(--raised);
    color: var(--text-2);
    font-size: 11.5px;
    line-height: 1.45;
}

.dock-badge.started {
    background: var(--accent-dim);
    color: var(--accent-text);
}

.dock-badge.waiting {
    background: color-mix(in srgb, var(--warn, #d9a441) 22%, transparent);
    color: var(--warn, #d9a441);
}

.dock-badge.cancelled,
.dock-badge.paused {
    color: var(--text-3);
}

.dock-title {
    min-width: 0;
    overflow: hidden;
    color: var(--text);
    font-weight: 500;
    text-overflow: ellipsis;
}

.dock-text {
    margin: 0 14px 0 36px;
    padding-bottom: 10px;
    overflow: hidden;
    color: var(--text-2);
    font-size: 13px;
    text-overflow: ellipsis;
    white-space: nowrap;
}

.dock-acts {
    display: flex;
    flex: none;
    gap: 6px;
    margin-left: auto;
}
.dock-fold {
    display: grid;
    padding: 4px;
    border: 0;
    background: none;
    cursor: pointer;
}
</style>
