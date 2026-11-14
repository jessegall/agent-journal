<script setup>
import {ref} from "vue";
import {Icon} from "@journal/window-kit";

// a bar that folds its cards away, as the agent inspector's bars do; it starts open, and its count is shown only when it is given one
defineProps({title: {type: String, required: true}, count: {type: Number, default: null}});
const open = ref(true);
</script>

<template>
    <section class="question-section" data-question-section>
        <button type="button" class="bar" :aria-expanded="open" @click="open = !open">
            <Icon name="chevronRight" :size="12" :facing="open ? 'down' : 'right'" />
            <span class="bar-title">{{ title }}</span>
            <template v-if="count !== null">
              <span class="bar-count" data-question-count>{{ count }}</span>
            </template>
        </button>
        <template v-if="open">
          <div class="cards"><slot /></div>
        </template>
    </section>
</template>

<style scoped>
.bar {
    display: flex;
    align-items: center;
    gap: 6px;
    width: 100%;
    padding: 8px var(--inset);
    border: 0;
    background: none;
    color: var(--text-2);
    font: inherit;
    font-size: 12.5px;
    font-weight: 600;
    cursor: pointer;
}

.bar-count {
    color: var(--text-3);
    font-weight: 400;
}

.cards {
    display: flex;
    flex-direction: column;
    gap: 12px;
    padding: 0 var(--inset) 12px;
}
</style>
