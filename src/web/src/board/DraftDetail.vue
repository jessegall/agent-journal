<script setup>
import {computed} from "vue";
import FlipCard from "../kit/FlipCard.vue";
import TextDisplay from "../kit/TextDisplay.vue";
import Btn from "../kit/Btn.vue";
import DraftLinks from "./DraftLinks.vue";

const props = defineProps({
    ticket: {type: Object, required: true},
    from: {type: Object, required: true},
    links: {type: Array, default: () => []},
    picked: Boolean,
    measure: {type: Function, default: null},
});
const risk = computed(() => (props.ticket.brief.match(/^Risk:\s*(.+)$/im) || [])[1] || "");
const waits = computed(() => Boolean(risk.value) && !/^none\b/i.test(risk.value));
const emit = defineEmits(["close", "keep", "link"]);
</script>

<template>
    <FlipCard :from="from" :measure="measure" @close="emit('close')">
        <template #front>
            <h3 class="title">{{ ticket.title }}</h3>
            <p class="line">{{ ticket.abstract }}</p>
        </template>
        <template #back>
            <h3 class="title">{{ ticket.title }}</h3>
            <template v-if="waits">
                <p class="approval">Waits for your approval before it starts</p>
            </template>
            <TextDisplay class="brief" :text="ticket.brief" />
            <template v-if="links.length">
                <DraftLinks class="back-links" :links="links" @toggle="(n) => emit('link', n)" />
            </template>
            <div class="back-actions">
                <Btn :kind="picked ? 'ghost' : 'primary'" small @click="emit('keep')">{{ picked ? "Kept" : "Keep" }}</Btn>
            </div>
        </template>
    </FlipCard>
</template>

<style scoped>
.title {
    margin: 0 0 12px;
    color: var(--text);
    font-size: 17px;
    font-weight: 500;
    line-height: 24px;
}

.line {
    margin: 0;
    color: var(--text-2);
    font-size: 15px;
    line-height: 23px;
}

.approval {
    margin: 0 0 12px;
    color: var(--warn, #e0b060);
    font-size: 13px;
}

.back-links {
    margin-top: 14px;
}

.back-actions {
    display: flex;
    justify-content: flex-end;
    margin-top: 16px;
}

.brief {
    color: var(--text-2);
    font-size: 14px;
    line-height: 22px;
}
</style>
