<script setup>
import ChoiceList from "./ChoiceList.vue";
import Switch from "./Switch.vue";

defineProps({
    title: {type: String, required: true},
    line: {type: String, default: ""},
    keys: {type: String, default: ""},
    side: {type: String, default: "below"},
    arrow: {type: String, default: "50%"},
    toggles: {type: Array, default: () => []},
    warning: {type: String, default: ""},
});
</script>

<template>
    <span :class="['tip', side]" :style="{'--arrow-x': arrow}">
        <span class="tip-title">
            <span>{{ title }}</span>
            <template v-if="keys">
                <kbd class="tip-keys">{{ keys }}</kbd>
            </template>
        </span>
        <template v-if="line">
            <span class="tip-line">{{ line }}</span>
        </template>
        <template v-if="warning">
            <span class="tip-warning">{{ warning }}</span>
        </template>
        <template v-if="toggles.length">
            <span class="tip-toggles">
                <template v-for="toggle in toggles" :key="toggle.key">
                    <span class="tip-setting">
                        <Switch class="tip-toggle" :on="toggle.on" :word="toggle.label" :title="toggle.label" beside @change="toggle.change" />
                        <template v-if="toggle.note">
                            <span class="tip-toggle-note">{{ toggle.note }}</span>
                        </template>
                        <template v-if="toggle.choices && toggle.choices.length">
                            <ChoiceList class="tip-toggle-choices" :choices="toggle.choices" @pick="toggle.pick" />
                        </template>
                    </span>
                </template>
            </span>
        </template>
        <span class="tip-arrow" />
    </span>
</template>

<style scoped>
.tip {
    display: block;
    width: max-content;
    max-width: min(280px, calc(100vw - 16px));
    padding: 7px 10px 8px;
    border: 1px solid var(--tip-edge);
    border-radius: 7px;
    background: var(--tip-bg);
    box-shadow: var(--tip-shadow);
    font-size: 12px;
    line-height: 1.4;
    text-align: left;
}

.tip-title {
    display: flex;
    align-items: baseline;
    justify-content: space-between;
    gap: 12px;
    color: var(--text);
    font-weight: 600;
}

.tip-line {
    display: block;
    margin-top: 2px;
    color: var(--text-2);
    text-wrap: pretty;
}

.tip-warning {
    display: block;
    margin-top: 4px;
    color: var(--tone-warn);
    text-wrap: pretty;
}

.tip-toggles {
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    gap: 4px;
    margin-top: 6px;
    padding-top: 6px;
    border-top: 1px solid var(--tip-edge);
}

.tip-setting {
    display: flex;
    flex-direction: column;
    align-items: flex-start;
}

.tip-toggle-note {
    display: block;
    margin: -4px 0 2px 36px;
    color: var(--text-3);
    font-size: 11px;
    line-height: 1.35;
    text-wrap: pretty;
}

.tip-toggle-choices {
    margin: 2px 0 4px 36px;
    padding: 0;
}

.tip-keys {
    flex: none;
    padding: 0 4px;
    border: 1px solid var(--border-3);
    border-radius: 4px;
    color: var(--text-3);
    font-family: var(--mono);
    font-size: 10.5px;
    font-weight: 500;
}

.tip-arrow {
    position: absolute;
    left: var(--arrow-x);
    width: 9px;
    height: 9px;
    margin-left: -4.5px;
    background: var(--tip-bg);
    transform: rotate(45deg);
}

.below .tip-arrow {
    top: -5px;
    border-top: 1px solid var(--tip-edge);
    border-left: 1px solid var(--tip-edge);
}

.above .tip-arrow {
    bottom: -5px;
    border-right: 1px solid var(--tip-edge);
    border-bottom: 1px solid var(--tip-edge);
}

.tip.sliding .tip-arrow {
    transition: left 120ms var(--ease);
}

@media (prefers-reduced-motion: reduce) {
    .tip.sliding .tip-arrow {
        transition: none;
    }
}
</style>
