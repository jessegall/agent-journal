<script setup>
import {computed, inject, ref, watch} from "vue";
import Btn from "../kit/Btn.vue";
import ButtonSlot from "../kit/ButtonSlot.vue";
import ChatDock from "../kit/ChatDock.vue";
import CloseButton from "../kit/CloseButton.vue";
import DockLeave from "./DockLeave.vue";
import FoldSign from "../kit/FoldSign.vue";
import Icon from "../kit/Icon.vue";
import MarkBody from "./MarkBody.vue";
import {lineResult, WINDOW_CONTEXT} from "../windows/windowContext.js";
import {cliOf} from "../domain/resourceKinds.js";
import {dockDeclaration} from "../domain/dockRegistry.js";
import {dockLook} from "../domain/dockLook.js";
import {pressButton} from "./markButtons.js";
import {peekRef} from "../route.js";

// one item docked above the chat, drawn as version 4 drew a docked card: the type's icon and title, its buttons, and the body its module gives it
const emit = defineEmits(["fold", "undock"]);
const props = defineProps({item: {type: Object, required: true}, folded: Boolean, leaving: Boolean, refusal: {type: String, default: ""}});
const declaration = computed(() => dockDeclaration(props.item.type));
const head = ref(null);
const look = computed(() => dockLook(props.item, declaration.value));
const context = inject(WINDOW_CONTEXT);
const row = ref(null);
let reading = 0;

async function loadRow() {
    const turn = ++reading;
    const kind = cliOf(props.item.target_model ?? "");
    const line = `${kind} show`;
    if (!declaration.value?.reads?.includes(line)) return;
    const answer = await lineResult(props.item.type, [kind, "show", String(props.item.target_id)], context.environment);
    if (turn !== reading) return;
    row.value = answer.ok ? {...answer.value, id: props.item.target_id, kind} : {id: props.item.target_id, kind};
}

watch(() => [props.item.type, props.item.target_model, props.item.target_id, declaration.value], (_, previous, cleanup) => {
    const kind = cliOf(props.item.target_model ?? "");
    row.value = {id: props.item.target_id, kind};
    loadRow();
    const stop = context.subscriptions?.follow(`dock ${props.item.id}`, [`${kind.replaceAll("-", "_")}.*`], (event) => {
        if (!event.row_id || event.row_id === props.item.target_id) loadRow();
    });
    cleanup(() => { reading += 1; stop?.(); });
}, {immediate: true});
// a declared button goes the moment it is pressed, and comes back if the server refuses
const pressed = ref(new Set());
const failure = ref("");
async function press(button) {
    if (button.action === "open") return peekRef(`${props.item.target_model}:${props.item.target_id}`);
    const isDeclared = button.action === "declared";
    if (isDeclared) pressed.value = new Set([...pressed.value, button.label]);
    failure.value = "";
    const answer = await pressButton(button, {id: props.item.target_id}, context.environment);
    if (answer?.ok !== false) return;
    pressed.value = new Set([...pressed.value].filter((label) => label !== button.label));
    failure.value = answer.error;
}
const buttons = computed(() => look.value.buttons.filter((button) => button.action !== "undock" && !pressed.value.has(button.label)));
const undock = computed(() => look.value.buttons.find((button) => button.action === "undock"));
</script>

<template>
    <ChatDock :label="look.title" :folded="folded" :data-figure-closing="leaving ? '' : null">
        <template #edge>
            <template v-if="leaving">
                <DockLeave :ends-at="item.leaves_at" />
            </template>
        </template>
        <template #head>
            <template v-if="declaration?.draws_head">
                <span ref="head" class="dock-head" data-dock-head />
            </template>
            <template v-else>
                <Icon :name="look.icon" class="dock-icon" />
                <span class="dock-title">{{ look.title }}</span>
            </template>
            <template v-if="declaration?.badge">
                <span :class="['dock-badge', item.type.split('.')[1]]" data-dock-badge>{{ declaration.badge }}</span>
            </template>
            <template v-if="!declaration?.draws_head">
                <button type="button" class="dock-fold" data-dock-fold :aria-expanded="!folded" :title="folded ? 'Unfold' : 'Fold'" @click="emit('fold')"><FoldSign :open="!folded" /></button>
            </template>
            <span class="chat-dock-acts dock-acts">
                <ButtonSlot :name="`dock.${item.type}`" :row="row" :environment="context.environment" :read-only="context.readOnly" @done="loadRow" />
                <template v-for="button in buttons" :key="button.action + button.runs">
                    <template v-if="button.iconOnly">
                        <Btn kind="icon" :aria-label="button.label" :title="button.label" :data-dock-action="button.action" @click="press(button)"><Icon :name="button.icon" :size="13" /></Btn>
                    </template>
                    <template v-else>
                        <Btn small :kind="button.primary ? 'primary' : 'ghost'" :bordered="!button.primary" :data-dock-action="button.action" @click="press(button)">{{ button.label }}</Btn>
                    </template>
                </template>
            </span>
            <CloseButton :title="undock.label" data-dock-action="undock" @click="emit('undock', undock)" />
        </template>
        <template v-if="failure || refusal">
            <p class="dock-text dock-failure" role="alert" data-dock-failure>{{ failure || refusal }}</p>
        </template>
        <template v-if="item.text && !declaration?.body_url">
            <p class="dock-text">{{ item.text }}</p>
        </template>
        <template v-if="declaration?.body_url">
            <MarkBody :declaration="declaration" :mark="item" shown :head="head" />
        </template>
    </ChatDock>
</template>

<style scoped>
.dock-head {
    display: flex;
    flex: 1 1 auto;
    align-items: center;
    gap: 9px;
    min-width: 0;
}

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

.dock-failure {
    color: var(--danger);
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
