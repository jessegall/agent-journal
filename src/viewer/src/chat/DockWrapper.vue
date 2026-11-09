<script setup>
import {computed, provide, ref, watch} from "vue";
import Btn from "../kit/Btn.vue";
import ButtonSlot from "../kit/ButtonSlot.vue";
import ChatDock from "../kit/ChatDock.vue";
import DockLeave from "./DockLeave.vue";
import FoldSign from "../kit/FoldSign.vue";
import Icon from "../kit/Icon.vue";
import MarkBody from "./MarkBody.vue";
import {provideDockCard, useWindow} from "../../kit/windowContextKey.js";
import {readOutputProp} from "../composables/outputPages.js";
import {useSharedNow} from "../composables/now.js";
import {ago} from "../format/time.js";
import {dockBadgeOf, cliOf} from "../domain/resourceNouns.js";
import {dockDeclaration} from "../domain/dockRegistry.js";
import {leaveSeconds} from "../domain/dockItems.js";
import {dockLook, shownTitle as titleOf} from "../domain/dockLook.js";
import {pressButton} from "./markButtons.js";
import {peekRef} from "../route.js";

// one item docked above the chat, drawn as version 4 drew a docked card: the type's icon and title, its buttons, and the body its module gives it
const emit = defineEmits(["fold", "undock", "open"]);
const props = defineProps({item: {type: Object, required: true}, folded: Boolean, collapsed: Boolean, leaving: Boolean, refusal: {type: String, default: ""}});
const declaration = computed(() => dockDeclaration(props.item.type));
const now = useSharedNow();
const age = computed(() => ago(props.item.created_at, now.value * 1000));
const head = ref(null);
const foot = ref(null);
const actions = ref(null);
const time = ref(null);
const look = computed(() => dockLook(props.item, declaration.value));
const view = useWindow();
const cardKey = computed(() => `dock.${props.item.id}`);
const card = computed(() => view.props[cardKey.value].data.value);
// a card that draws its own head names the item by what it holds, as its card says, and by the dock's generic title only until it has read
const shownTitle = computed(() => titleOf(props.item, declaration.value, card.value));
const term = computed(() => cliOf(props.item.target_model ?? ""));
const rowWord = computed(() => declaration.value?.word ?? "");
const row = computed(() => ({...card.value, id: props.item.target_id, term: term.value}));
const reloadCard = () => declaration.value?.reads?.length && view.reload(cardKey.value);
provideDockCard(provide, {data: card, reload: reloadCard, readOutput: readOutputProp(view)});

watch(
    () => [props.item.type, props.item.target_model, props.item.target_id, declaration.value],
    (_, previous, cleanup) => {
        reloadCard();
        const stop = view.followUndeclared?.([`${term.value.replaceAll("-", "_")}.*`], (event) => {
            if (!event.row_id || event.row_id === props.item.target_id) reloadCard();
        });
        cleanup(() => stop?.());
    },
    {immediate: true}
);
// a declared button goes the moment it is pressed, and comes back if the server refuses
const pressed = ref(new Set());
const failure = ref("");
async function press(button) {
    if (button.action === "undock") return emit("undock", button);
    if (button.action === "open") return peekRef(`${props.item.target_model}:${props.item.target_id}`);
    const isDeclared = button.action === "declared";
    if (isDeclared) pressed.value = new Set([...pressed.value, button.label]);
    failure.value = "";
    const answer = await pressButton(button, {id: props.item.target_id}, view.environment);
    if (answer?.ok !== false) return;
    pressed.value = new Set([...pressed.value].filter((label) => label !== button.label));
    failure.value = `Could not ${button.label.toLowerCase()}: ${answer.error}`;
}
const buttons = computed(() => look.value.actions.filter((button) => !pressed.value.has(button.label)));
const badge = computed(() => dockBadgeOf(declaration.value?.badge, row.value));
// a folded or collapsed card keeps all its head icons: Open, the pin and X
const controls = computed(() => look.value.controls);
const ownsHead = computed(() => Boolean(declaration.value?.draws_head) && !props.collapsed);
</script>

<template>
    <ChatDock
        :label="look.title + (declaration?.needs_user ? ', waiting for you' : '')"
        :type="declaration?.needs_user ? 'waiting' : ''"
        :folded="Boolean(declaration?.folds) && folded"
        :body="Boolean(declaration?.folds)"
        :collapsed="collapsed"
        :data-figure-closing="leaving ? '' : null"
        @click="collapsed && emit('open')"
    >
        <template #edge>
            <template v-if="leaving && !item.kept"><DockLeave :ends-at="leaveSeconds(item)" /></template>
        </template>
        <template #head>
            <template v-if="ownsHead"><span ref="head" class="dock-head" data-dock-head /></template>
            <template v-else>
                <Icon :name="look.icon" class="dock-icon" :size="14" />
                <span class="dock-text">
                    <span :class="['dock-title', {strip: collapsed}]" :title="shownTitle">{{ shownTitle }}</span>
                </span>
            </template>
            <span ref="time" class="dock-age" data-dock-age>
                <template v-if="!declaration?.leaves_after_seconds">{{ age }}</template>
            </span>
            <template v-if="controls.length">
                <span class="dock-controls" @click.stop>
                    <template v-for="button in controls" :key="button.action + button.runs">
                        <template
                            v-if="
                                !pressed.has(button.label) &&
                                (!button.variants?.length || !row?.state || button.variants.includes(row.state))
                            "
                        >
                            <Btn
                                variant="icon"
                                :class="{kept: button.pressed}"
                                :aria-pressed="button.pressed"
                                :aria-label="button.label"
                                :title="button.label"
                                :data-dock-action="button.action"
                                @click="press(button)"
                            >
                                <Icon :name="button.icon" :size="13" />
                            </Btn>
                        </template>
                    </template>
                </span>
            </template>
        </template>
        <template #still>
            <template v-if="failure || refusal">
                <p class="dock-failure" role="alert" data-dock-failure>{{ failure || refusal }}</p>
            </template>
        </template>
        <template #foot>
            <span class="dock-facts" data-dock-facts>
                <template v-if="badge">
                    <span :class="['dock-badge', item.type.split('.')[1]]" data-dock-badge>{{ badge }}</span>
                </template>
                <template v-if="rowWord"><span data-dock-row>{{ rowWord }} {{ item.target_id }}</span></template>
                <span ref="foot" class="dock-module-facts" />
            </span>
            <template v-if="declaration?.folds">
                <Btn small class="dock-fold" data-dock-fold :aria-expanded="!folded" @click="emit('fold')">
                    {{ declaration.folds }}
                    <FoldSign :open="!folded" />
                </Btn>
            </template>
            <span class="dock-acts">
                <span ref="actions" class="dock-module-actions" />
                <ButtonSlot
                    :name="`dock.${item.type}`"
                    :row="row"
                    :environment="view.environment"
                    :read-only="view.readOnly"
                    :object-name="cliOf(item.target_model)"
                    external-failure
                    @failure="failure = $event"
                    @done="loadRow"
                />
                <template v-for="button in buttons" :key="button.action + button.runs">
                    <Btn
                        small
                        :variant="button.primary ? 'primary' : 'ghost'"
                        :bordered="!button.primary"
                        :data-dock-action="button.action"
                        @click="press(button)"
                    >
                        {{ button.label }}
                    </Btn>
                </template>
            </span>
        </template>
        <template v-if="declaration?.body_url">
            <MarkBody
                :declaration="declaration"
                :mark="item"
                shown
                :head="head"
                :foot="foot"
                :actions="actions"
                :time="time"
                :folded="folded"
                :collapsed="collapsed"
            />
        </template>
    </ChatDock>
</template>

<style scoped>
.dock-head {
    display: flex;
    flex: 1 1 auto;
    align-items: center;
    gap: 8px;
    min-width: 0;
}
.dock-icon {
    flex: none;
    color: var(--text-3);
}
.dock-text {
    display: flex;
    flex: 1 1 auto;
    flex-direction: column;
    min-width: 0;
}
.dock-title.strip { font-size: 12px; }
.dock-title {
    flex: 1 1 auto;
    min-width: 0;
    overflow: hidden;
    color: var(--text);
    font-size: 13px;
    font-weight: 500;
    line-height: 20px;
    text-overflow: ellipsis;
    white-space: nowrap;
}
.dock-age {
    display: inline-flex;
    flex: none;
    align-items: center;
    align-self: center;
    justify-content: flex-end;
    width: 64px;
    margin-left: 6px;
    line-height: 20px;
    color: var(--text-3);
    font-size: 11.5px;
    font-variant-numeric: tabular-nums;
}
.dock-controls {
    display: flex;
    flex: none;
    gap: 2px;
}
.dock-controls .kept {
    color: var(--accent-text);
}
.dock-controls .kept :deep(svg) {
    color: var(--accent-text);
    fill: currentColor;
}
.dock-facts {
    display: flex;
    flex: 0 1 auto;
    align-items: center;
    gap: 10px;
    min-width: 0;
    min-height: 24px;
    padding-right: 6px;
    color: var(--text-3);
    font-size: 12px;
    font-variant-numeric: tabular-nums;
    white-space: nowrap;
}
.dock-module-facts,
.dock-module-actions {
    display: contents;
}
.dock-facts :deep(b) {
    color: var(--text-2);
    font-weight: 400;
}
.dock-badge {
    padding: 1px 8px;
    border-radius: 999px;
    background: var(--chip);
    color: var(--text-2);
    font-size: 11.5px;
}
.dock-badge.started {
    background: var(--accent-dim);
    color: var(--accent-text);
}
.dock-badge.cancelled,
.dock-badge.paused {
    color: var(--text-3);
}
.dock-failure {
    margin: 3px 0 6px;
    padding: 6px 14px 7px 36px;
    border-block: 1px solid var(--border-inner);
    color: var(--danger);
    font-size: 12.5px;
    line-height: 1.45;
    overflow-wrap: anywhere;
}
.dock-acts {
    display: flex;
    flex: none;
    flex-wrap: wrap;
    justify-content: flex-end;
    gap: 6px;
    max-width: 100%;
    margin-left: auto;
}

.dock-fold.btn,
.dock-fold.btn:hover {
    padding: 0;
    border: 0;
    background: none;
}
.dock-acts :deep(.button-slot) {
    display: contents;
}
@container (max-width: 480px) {
    .dock-facts {
        padding-right: 0;
    }
}
</style>
