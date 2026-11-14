<script setup>
// the shell's one toast area: the text of the toast raised last and, when it can be taken back, an Undo button
defineProps({toasts: {type: Object, required: true}});
</script>

<template>
    <template v-if="toasts.current.value">
      <div class="toast" role="status" data-toast>
          <span class="toast-text" data-toast-text>{{ toasts.current.value.text }}</span>
          <template v-if="toasts.current.value.undo">
            <button type="button" class="toast-undo" data-toast-undo @click="toasts.undo()">Undo</button>
          </template>
      </div>
    </template>
</template>

<style scoped>
.toast {
    position: fixed;
    z-index: 90;
    bottom: 20px;
    left: 50%;
    display: flex;
    align-items: center;
    gap: var(--s3);
    padding: 8px var(--s4);
    transform: translateX(-50%);
    border: 1px solid var(--border-3);
    border-radius: 10px;
    background: var(--sel);
    box-shadow: var(--tip-shadow);
    color: var(--text);
    font-size: 12.5px;
}

.toast-undo {
    padding: 0;
    border: 0;
    background: none;
    color: var(--accent-text);
    font: inherit;
    font-weight: 500;
    cursor: pointer;
}
</style>
