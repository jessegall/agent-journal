<script setup>
import Btn from "../kit/Btn.vue";
import Dialog from "../kit/Dialog.vue";

defineProps({move: Object});
const emit = defineEmits(["stop", "keep", "close"]);
</script>

<template>
    <Dialog :title="`Stop #${move.card.n}'s agent?`" @close="emit('close')">
        <p class="text">It is working on {{ move.card.title }}. Its branch and its changes stay either way.</p>
        <div class="actions">
            <Btn small @click="emit('close')">Cancel</Btn>
            <Btn small @click="emit('keep')">Move, keep it working</Btn>
            <Btn kind="primary" small @click="emit('stop')">Stop its agent and move</Btn>
        </div>
    </Dialog>
</template>

<style scoped>
.text {
    margin: 0 0 14px;
    color: var(--text-2);
    font-size: 13px;
    line-height: 1.5;
}

.actions {
    display: flex;
    justify-content: flex-end;
    gap: 8px;
}
</style>
