<script setup>
import Icon from "../kit/Icon.vue";
import Button from "./kit/Button.vue";

defineProps({unseen: {type: Number, default: 0}});
const emit = defineEmits(["newest"]);
</script>

<template>
    <Button
        kind="round"
        class="home-newest"
        :aria-label="unseen ? `Scroll to newest, ${unseen} new` : 'Scroll to newest'"
        @click="emit('newest')"
    >
        <Icon name="down" :size="18" />
        <template v-if="unseen">
            <span class="home-unseen" aria-hidden="true">{{ unseen }}</span>
        </template>
    </Button>
</template>

<style scoped>
.home-newest.round {
    position: absolute;
    bottom: calc(var(--dock, 140px) + 14px + var(--keyboard, 0px));
    left: 50%;
    z-index: 2;
    margin-left: -22px;
    color: var(--text);
    animation: newest-in 200ms ease-out;
}

.home-unseen {
    position: absolute;
    top: -6px;
    right: -8px;
    display: flex;
    align-items: center;
    justify-content: center;
    min-width: 18px;
    min-height: 18px;
    padding: 0 5px;
    border-radius: 999px;
    background: var(--accent);
    color: #fff;
    font-size: 11px;
    font-weight: 600;
    line-height: 1;
}

@keyframes newest-in {
    from {
        opacity: 0;
        transform: scale(0.8);
    }
}
</style>
