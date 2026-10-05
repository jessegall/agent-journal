<script setup>
import {feedOn} from "../composables/settings.js";
import {store} from "../state/store.js";
import {computed, inject} from "vue";
import Icon from "../kit/Icon.vue";
import AgentFact from "./AgentFact.vue";

defineProps({open: {type: String, default: ""}});
const emit = defineEmits(["toggle"]);
const views = inject("views", null);
const PANES = [
    {key: "chat", icon: "chat", title: "Chat"},
    {key: "feed", icon: "edits", title: "File feed: the agent's edits as it makes them"},
    {key: "terminal", icon: "terminal", title: "What the agent ran lately, like a terminal"},
];
const panes = computed(() => PANES.filter((p) => p.key !== "feed" || feedOn.value));
const viewGroups = computed(() =>
    ["agent", "panel"].map((key) => {
        const items = views ? views.items.value.filter((v) => v.group === key) : [];
        return {key, items, hasClosed: items.some((v) => !v.open)};
    })
);
</script>

<template>
    <template v-if="views">
        <template v-for="x in views.away.value" :key="x.id">
            <button type="button" class="agent-away" title="Open in another tab; click to bring it back here" @click="views.back(x.id)">
                <Icon name="open" :size="12" />
                {{ x.title }} in another tab
            </button>
        </template>
        <template v-for="(group, at) in viewGroups" :key="group.key">
            <template v-if="at">
                <span :class="['agent-divider', 'agent-views-divider', {gone: !group.hasClosed || !viewGroups[0].hasClosed}]" />
            </template>
            <div class="agent-panes">
                <template v-for="v in group.items" :key="v.key">
                    <button
                        type="button"
                        :class="['agent-pane', 'agent-view', {gone: v.open, lifting: v.lifting}]"
                        :title="`${v.title}: drag it onto a pane, or click to open it`"
                        :tabindex="v.open ? -1 : 0"
                        @pointerdown="views.grab($event, v.key)"
                    >
                        <Icon :name="v.icon" />
                    </button>
                </template>
            </div>
        </template>
        <span class="agent-divider" />
        <AgentFact
            :class="['agent-fact', 'agent-count', 'agent-presets', {open: open === 'presets'}]"
            icon="layout"
            title="Layout presets"
            :aria-expanded="open === 'presets'"
            @click="emit('toggle', 'presets', $event)"
        >
            Presets
            <Icon name="caret" />
        </AgentFact>
    </template>
    <template v-else>
        <div class="agent-panes">
            <template v-for="p in panes" :key="p.key">
                <button
                    type="button"
                    :class="['agent-pane', {on: store.pane === p.key}]"
                    :title="p.title"
                    :aria-pressed="store.pane === p.key"
                    @click="((store.dumping = false), (store.pane = p.key))"
                >
                    <Icon :name="p.icon" />
                </button>
            </template>
        </div>
    </template>
</template>

<style scoped>
.agent-actions .agent-count {
    height: 24px;
    margin: 0;
    padding: 0 7px;
}

.agent-actions .agent-presets {
    gap: 5px;
    padding-right: 2px;
}

.agent-divider {
    width: 1px;
    height: 14px;
    margin: 0 4px;
    background: var(--border-2);
}

.agent-panes {
    display: flex;
    gap: 2px;
}

.agent-pane {
    display: grid;
    place-items: center;
    width: 26px;
    height: 24px;
    padding: 0;
    border: 0;
    border-radius: 6px;
    background: none;
    color: var(--text-3);
    transition:
        background 0.15s,
        color 0.15s;
}

.agent-pane :deep(.ico) {
    color: inherit;
}

.agent-pane:hover {
    background: var(--hover);
    color: var(--text);
}

.agent-pane.on {
    background: var(--sel);
    color: var(--text);
}

.agent-view {
    overflow: hidden;
    cursor: grab;
    touch-action: none;
    transition:
        width 0.24s var(--ease),
        margin 0.24s var(--ease),
        opacity 0.2s ease,
        transform 0.24s var(--ease),
        background 0.15s,
        color 0.15s;
}

.agent-view.gone {
    width: 0;
    margin-left: -2px;
    opacity: 0;
    transform: scale(0.6);
    pointer-events: none;
}

.agent-view.lifting {
    opacity: 0.35;
}

.agent-away {
    display: inline-flex;
    align-items: center;
    gap: 6px;
    height: 24px;
    margin-right: 4px;
    padding: 0 8px;
    border: 1px solid var(--border-2);
    border-radius: 6px;
    background: none;
    color: var(--text-2);
    font: inherit;
    white-space: nowrap;
    cursor: pointer;
    transition:
        background 0.15s,
        color 0.15s;
}

.agent-away :deep(.ico) {
    color: inherit;
}

.agent-away:hover {
    background: var(--hover);
    color: var(--text);
}

.agent-views-divider {
    transition:
        opacity 0.2s ease,
        width 0.24s var(--ease),
        margin 0.24s var(--ease);
}

.agent-views-divider.gone {
    width: 0;
    margin: 0 -1px;
    opacity: 0;
}

@media (prefers-reduced-motion: reduce) {
    .agent-view,
    .agent-views-divider {
        transition: none;
    }
}
</style>
