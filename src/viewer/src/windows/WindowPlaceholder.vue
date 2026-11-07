<script setup>
import Btn from "../kit/Btn.vue";
import EmptyState from "../kit/EmptyState.vue";

defineProps({name: {type: String, required: true}, reason: {type: String, required: true}, retry: Boolean, removable: Boolean});
const emit = defineEmits(["retry", "remove"]);
</script>

<template>
    <EmptyState class="window-placeholder" :title="name">{{ reason }}
        <template v-if="retry">
            <Btn @click="emit('retry')">Retry</Btn>
        </template>
        <template v-if="removable">
            <Btn @click="emit('remove')">Remove tab</Btn>
        </template>
    </EmptyState>
</template>
