<script setup>
import TextDisplay from "../kit/TextDisplay.vue";
import OptionsPicker from "../resource/OptionsPicker.vue";

defineProps({turn: {type: Object, required: true}});
</script>

<template>
    <div class="turn-question">
        <template v-if="turn.abstract">
            <TextDisplay class="thread-context" :text="turn.abstract" />
        </template>
        <OptionsPicker :resource="turn" />
    </div>
</template>

<style scoped>
.turn-question {
    width: 100%;
}

.thread-context {
    margin: 4px 0 0;
    color: var(--text-3);
    font-size: 12.5px;
}
</style>
