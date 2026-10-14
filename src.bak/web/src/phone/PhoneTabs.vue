<script setup>
import Icon from "../kit/Icon.vue";

const TABS = [
    {key: "chat", label: "Chat", icon: "chat"},
    {key: "home", label: "Home", icon: "home"},
    {key: "todos", label: "To-dos", icon: "todos"},
    {key: "everything", label: "Everything", icon: "tiles"},
];
const props = defineProps({screen: {type: String, required: true}, count: {type: Number, default: 0}});
const emit = defineEmits(["pick"]);
const said = (tab) => (tab.key === "home" && props.count ? `${tab.label}, ${props.count} ${props.count === 1 ? "needs" : "need"} you` : tab.label);
</script>

<template>
    <nav class="tabs" role="tablist" aria-label="Screens">
        <template v-for="tab in TABS" :key="tab.key">
            <button
                type="button"
                role="tab"
                :data-tab="tab.key"
                :aria-selected="screen === tab.key"
                :aria-label="said(tab)"
                :class="['tab', {on: screen === tab.key}]"
                @click="emit('pick', tab.key)"
            >
                <span class="tab-icon">
                    <Icon :name="tab.icon" :size="24" />
                    <template v-if="tab.key === 'home' && count">
                        <span class="tab-badge" aria-hidden="true">{{ count }}</span>
                    </template>
                </span>
                <span class="tab-label" aria-hidden="true">{{ tab.label }}</span>
            </button>
        </template>
    </nav>
</template>

<style scoped>
.tabs {
    display: flex;
    flex: none;
    max-width: none;
    padding: 0 var(--side) var(--safe-bottom);
    border-top: 1px solid var(--line);
    background: var(--bg);
}

.tab {
    display: flex;
    flex: 1;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: 2px;
    min-height: 49px;
    padding: 4px 0 2px;
    border: 0;
    background: none;
    color: var(--text-3);
    font: inherit;
}

.tab.on {
    color: var(--accent-text);
}

.tab-icon {
    position: relative;
    display: flex;
}

.tab-badge {
    position: absolute;
    top: -6px;
    left: calc(100% - 10px);
    display: flex;
    align-items: center;
    justify-content: center;
    min-width: 17px;
    min-height: 17px;
    padding: 0 5px;
    border-radius: 999px;
    background: var(--badge);
    color: #fff;
    font-size: 11px;
    font-weight: 600;
    line-height: 1;
    text-align: center;
}

.tab-label {
    font-size: 0.588rem;
    font-weight: 500;
}
</style>
