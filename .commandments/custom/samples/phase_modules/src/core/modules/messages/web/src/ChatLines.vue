<script setup>
import {MessageCard} from "@journal/window-kit";
defineProps({row: {type: Object, required: true}});
</script>

<template>
    <!-- @sin architecture_viewer_chat_message_not_a_card -->
    <span class="from">{{ row.type }}</span><span class="text">{{ row.text }}</span>
    <!-- @righteous architecture_viewer_chat_message_not_a_card -->
    <MessageCard :message="row" />
</template>
