<script setup>
import {computed} from "vue";
import ChatMark from "../kit/ChatMark.vue";

const props = defineProps({item: {type: Object, required: true}});
const label = computed(() => (props.item.name ? `${props.item.label} **${props.item.name}**` : props.item.label));
</script>

<template>
    <ChatMark
        :icon="item.icon"
        :tone="item.tone"
        :color="item.color"
        :label="label"
        :detail="item.detail"
        :card="item.card"
        :state="item.state"
        :command="item.command"
        :at="item.created"
    />
</template>
