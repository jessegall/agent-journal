<script setup>
import Btn from "../kit/Btn.vue";

defineProps({tour: {type: Object, required: true}});
</script>

<template>
    <template v-if="tour.current.value">
        <div class="pane-tour" role="dialog" aria-label="Tour of the panes">
            <p class="pane-tour-title">{{ tour.current.value.title }} <span class="pane-tour-step">{{ tour.step.value + 1 }} of {{ tour.count }}</span></p>
            <p class="pane-tour-text">{{ tour.current.value.text }}</p>
            <div class="pane-tour-row">
                <Btn kind="primary" data-tour="next" @click="tour.next()">{{ tour.step.value + 1 < tour.count ? "Next" : "Done" }}</Btn>
                <Btn data-tour="skip" @click="tour.skip()">Skip</Btn>
            </div>
        </div>
    </template>
    <template v-else-if="tour.hint.value">
        <div class="pane-menu-hint" role="note">
            <span>The ... button on a pane opens its menu: split, move or detach a window.</span>
            <Btn small data-hint="done" @click="tour.understood()">Got it</Btn>
        </div>
    </template>
</template>

<style scoped>
.pane-tour,
.pane-menu-hint {
    position: fixed;
    right: 16px;
    bottom: 16px;
    z-index: 80;
    max-width: 320px;
    padding: 12px 14px;
    border: 1px solid var(--border-3);
    border-radius: 8px;
    background: var(--raised);
    font-size: 13px;
}

.pane-tour-title {
    margin: 0 0 4px;
    font-weight: 600;
}

.pane-tour-step {
    margin-left: 6px;
    color: var(--text-3);
    font-weight: 400;
}

.pane-tour-text {
    margin: 0 0 10px;
    color: var(--text-2);
}

.pane-tour-row,
.pane-menu-hint {
    display: flex;
    align-items: center;
    gap: 8px;
}
</style>
