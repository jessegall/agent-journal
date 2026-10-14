<script setup>
import Icon from "../../kit/Icon.vue";

defineProps({title: {type: String, required: true}, back: {type: String, default: ""}, under: {type: Boolean, default: false}});
const emit = defineEmits(["back"]);
</script>

<template>
    <header :class="['navbar', {under}]">
        <template v-if="back">
            <button type="button" class="nav-back" :aria-label="`Back to ${back}`" @click="emit('back')">
                <Icon name="back" :size="22" />
                <span class="nav-back-word">{{ back }}</span>
            </button>
        </template>
        <template v-else>
            <span />
        </template>
        <span class="nav-mid" aria-hidden="true">{{ title }}</span>
        <span class="nav-end">
            <slot />
        </span>
    </header>
</template>

<style scoped>
.navbar {
    position: relative;
    display: flex;
    flex: none;
    align-items: center;
    justify-content: space-between;
    gap: 8px;
    min-height: 44px;
    margin: 0 calc(-1 * var(--side));
    padding: 0 8px;
    border-bottom: 1px solid transparent;
    transition: border-color 200ms linear;
}

.navbar.under {
    border-bottom-color: var(--line);
}

.nav-back {
    display: flex;
    align-items: center;
    gap: 2px;
    min-width: 44px;
    min-height: 44px;
    max-width: 45%;
    padding: 0 8px 0 2px;
    border: 0;
    background: none;
    color: var(--accent-text);
    font: inherit;
    font-size: 1.0625rem;
}

.nav-back-word {
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
}

.nav-mid {
    position: absolute;
    left: 50%;
    max-width: 50%;
    overflow: hidden;
    font-size: 1.0625rem;
    font-weight: 600;
    white-space: nowrap;
    text-overflow: ellipsis;
    opacity: 0;
    transform: translateX(-50%);
    transition: opacity 160ms linear;
}

.navbar.under .nav-mid {
    opacity: 1;
}

.nav-end {
    display: flex;
    gap: 2px;
    margin-left: auto;
}
</style>
