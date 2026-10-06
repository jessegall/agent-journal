<script setup>
import {computed} from "vue";
import {placeOf} from "./everything.js";
import EmptyList from "./kit/EmptyList.vue";
import ItemScreen from "./kit/ItemScreen.vue";

const props = defineProps({target: {type: String, required: true}, back: {type: String, default: ""}});
const emit = defineEmits(["back"]);
const place = computed(() => placeOf(props.target));
</script>

<template>
    <ItemScreen :title="place.label" :about="place.label" :back="back" @back="emit('back')">
        <EmptyList
            :icon="place.icon"
            :title="`${place.label} is not on the phone yet`"
            :reason="`${place.sub}. Open it on your computer for now.`"
        />
    </ItemScreen>
</template>
