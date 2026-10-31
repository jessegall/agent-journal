<script setup>
import {MessageCard} from "@journal/window-kit";
defineProps({row: {type: Object, required: true}});
</script>

<template>
    <!-- @sin architecture_viewer_ChatMessageIsCardDetector -->
    <span class="from">{{ row.type }}</span><span class="text">{{ row.text }}</span>
    <!-- @righteous architecture_viewer_ChatMessageIsCardDetector -->
    <MessageCard :message="row" />
</template>
