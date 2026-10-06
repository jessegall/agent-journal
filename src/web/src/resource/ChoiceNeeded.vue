<script setup>
import {computed} from "vue";
import {choiceGroups} from "../domain/buttons.js";
import Btn from "../kit/Btn.vue";
import Notice from "../kit/Notice.vue";

const props = defineProps({resource: {type: Object, required: true}});
const emit = defineEmits(["go"]);
const question = computed(() => choiceGroups(props.resource).find((group) => !group.chosen)?.ask || "");
</script>

<template>
    <Notice tone="need" icon="bell">
        <strong class="title">Your answer is needed</strong>
        <template v-if="question">
            <span class="ask">{{ question }}</span>
        </template>
        <template #actions>
            <Btn kind="primary" small @click="emit('go')">Go to the choice</Btn>
        </template>
    </Notice>
</template>

<style scoped>
.title,
.ask {
    display: block;
}

.title {
    font-weight: 700;
}

.ask {
    color: var(--text-2);
}
</style>
