<script setup>
import {computed, inject, ref, watch} from "vue";
import Btn from "../kit/Btn.vue";
import ButtonSlot from "../kit/ButtonSlot.vue";
import ChatDock from "../kit/ChatDock.vue";
import DockLeave from "./DockLeave.vue";
import FoldSign from "../kit/FoldSign.vue";
import Icon from "../kit/Icon.vue";
import MarkBody from "./MarkBody.vue";
import {lineResult, WINDOW_CONTEXT} from "../windows/windowContext.js";
import {useSharedNow} from "../composables/now.js";
import {ago} from "../format/time.js";
import {cliOf} from "../domain/resourceKinds.js";
import {dockDeclaration} from "../domain/dockRegistry.js";
import {dockLook} from "../domain/dockLook.js";
import {pressButton} from "./markButtons.js";
import {peekRef} from "../route.js";

// one item docked above the chat, drawn as version 4 drew a docked card: the type's icon and title, its buttons, and the body its module gives it
const emit = defineEmits(["fold", "undock"]);
const props = defineProps({item: {type: Object, required: true}, folded: Boolean, leaving: Boolean, refusal: {type: String, default: ""}});
const declaration = computed(() => dockDeclaration(props.item.type));
const now = useSharedNow();
const age = computed(() => ago(props.item.created_at, now.value * 1000));
const head = ref(null);
const foot = ref(null);
const actions = ref(null);
const time = ref(null);
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
    failure.value = `Could not ${button.label.toLowerCase()}: ${answer.error}`;
}
const buttons = computed(() => look.value.actions.filter((button) => button.action !== "undock" && !pressed.value.has(button.label)));
const undock = computed(() => look.value.buttons.find((button) => button.action === "undock"));
</script>

<template>
    <ChatDock :label="look.title + (declaration?.waits_on_you ? ', waiting for you' : '')" :kind="declaration?.waits_on_you ? 'waiting' : ''" :folded="Boolean(declaration?.folds) && folded" :body="Boolean(declaration?.folds)" :data-figure-closing="leaving ? '' : null">
        <template #edge>
            <DockLeave v-if="leaving && !item.kept" :ends-at="item.leaves_at" />
        </template>
        <template #head>
            <span v-if="declaration?.draws_head" ref="head" class="dock-head" data-dock-head />
            <template v-else>
                <Icon :name="look.icon" class="dock-icon" :size="14" />
                <span class="dock-title" :title="look.title">{{ look.title }}</span>
            </template>
            <span v-if="look.controls.length" class="dock-controls">
                <template v-for="button in look.controls" :key="button.action + button.runs">
                    <Btn v-if="!pressed.has(button.label) && (!button.variants?.length || !row?.state || button.variants.includes(row.state))" kind="icon" :class="{kept: button.pressed}" :aria-pressed="button.pressed" :aria-label="button.label" :title="button.label" :data-dock-action="button.action" @click="press(button)"><Icon :name="button.icon" :size="13" /></Btn>
                </template>
            </span>
            <span ref="time" class="dock-age" data-dock-age><template v-if="!declaration?.draws_head">{{ age }}</template></span>
        </template>
        <template #still>
            <p v-if="failure || refusal" class="dock-failure" role="alert" data-dock-failure>{{ failure || refusal }}</p>
        </template>
        <template #foot>
            <span class="dock-facts">
                <span v-if="declaration?.badge" :class="['dock-badge', item.type.split('.')[1]]" data-dock-badge>{{ declaration.badge }}</span>
                <span v-if="declaration?.word">{{ declaration.word }}</span>
                <span ref="foot" class="dock-module-facts" />
                <span v-if="item.kept" class="dock-kept">Kept</span>
            </span>
            <Btn v-if="declaration?.folds" small bordered data-dock-fold :aria-expanded="!folded" @click="emit('fold')">{{ declaration.folds }}<FoldSign :open="!folded" /></Btn>
            <span class="dock-acts">
                <span ref="actions" class="dock-module-actions" />
                <ButtonSlot :name="`dock.${item.type}`" :row="row" :environment="context.environment" :read-only="context.readOnly" external-failure @failure="failure = $event" @done="loadRow" />
                <template v-for="button in buttons" :key="button.action + button.runs">
                    <Btn small :kind="button.primary ? 'primary' : 'ghost'" :bordered="!button.primary" :data-dock-action="button.action" @click="press(button)">{{ button.label }}</Btn>
                </template>
                <Btn small bordered :title="undock.label" data-dock-action="undock" @click="emit('undock', undock)">Close</Btn>
            </span>
        </template>
        <MarkBody v-if="declaration?.body_url" :declaration="declaration" :mark="item" shown :head="head" :foot="foot" :actions="actions" :time="time" :folded="folded" />
    </ChatDock>
</template>

<style scoped>
.dock-head { display: flex; flex: 1 1 auto; align-items: center; gap: 8px; min-width: 0; }
.dock-icon { flex: none; color: var(--text-3); }
.dock-title { flex: 1 1 auto; min-width: 0; overflow: hidden; color: var(--text); font-size: 13px; font-weight: 500; text-overflow: ellipsis; white-space: nowrap; }
.dock-age { flex: none; margin-left: 6px; color: var(--text-3); font-size: 11.5px; font-variant-numeric: tabular-nums; }
.dock-controls { display: flex; flex: none; gap: 2px; }
.dock-controls + .dock-age { margin-left: 0; }
.dock-controls .kept { color: var(--accent-text); }
.dock-controls .kept :deep(svg) { color: var(--accent-text); fill: currentColor; }
.dock-facts { display: flex; flex: 0 1 auto; align-items: center; gap: 10px; min-width: 0; min-height: 24px; margin-right: auto; padding-right: 6px; color: var(--text-3); font-size: 12px; font-variant-numeric: tabular-nums; white-space: nowrap; }
.dock-module-facts, .dock-module-actions { display: contents; }
.dock-facts :deep(b), .dock-kept { color: var(--text-2); font-weight: 400; }
.dock-badge { padding: 1px 8px; border-radius: 999px; background: var(--chip); color: var(--text-2); font-size: 11.5px; }
.dock-badge.started { background: var(--accent-dim); color: var(--accent-text); }
.dock-badge.cancelled, .dock-badge.paused { color: var(--text-3); }
.dock-failure { margin: 3px 0 6px; padding: 6px 14px 7px 36px; border-block: 1px solid var(--border-inner); color: var(--danger); font-size: 12.5px; line-height: 1.45; overflow-wrap: anywhere; }
.dock-acts { display: flex; flex: none; flex-wrap: wrap; justify-content: flex-end; gap: 6px; max-width: 100%; }
@container (max-width: 480px) { .dock-facts { padding-right: 0; } }
</style>
