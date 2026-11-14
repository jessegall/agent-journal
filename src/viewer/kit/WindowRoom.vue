<script setup>
// the room of a window: it grows to the window's full width and height and pads what is put inside; a host gives a window no padding, so each window says its own here or in its own parts
defineProps({padding: {type: String, default: "8px 12px"}});
</script>

<template>
    <div class="window-room" data-window-room :style="{padding}"><slot /></div>
</template>

<style scoped>
.window-room {
    box-sizing: border-box;
    width: 100%;
    height: 100%;
}
</style>
