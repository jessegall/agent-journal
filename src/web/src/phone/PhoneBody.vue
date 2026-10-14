<script setup>
import PhoneFold from "./PhoneFold.vue";
import TextDisplay from "../kit/TextDisplay.vue";
import {textParts} from "../format/processed.js";

defineProps({body: {type: String, default: ""}, sections: {type: Array, default: () => []}, onlyFiles: {type: Boolean, default: false}});
</script>

<template>
    <PhoneFold>
        <template v-if="!onlyFiles">
            <TextDisplay :text="body" />
        </template>
        <template v-for="part in textParts(sections)" :key="part.title">
            <h3 class="turn-part">{{ part.title }}</h3>
            <TextDisplay :text="part.body" />
        </template>
    </PhoneFold>
</template>

<style scoped>
.turn-part {
    margin: 10px 0 4px;
    font-size: 1rem;
    font-weight: 600;
}
</style>
