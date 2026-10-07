<script setup>
import Icon from "../../kit/Icon.vue";

defineProps({about: {type: String, required: true}});
const emit = defineEmits(["more"]);
</script>

<template>
    <button type="button" class="row-more" :aria-label="`Everything you can do with ${about}`" @click.stop="emit('more')">
        <Icon name="dots" :size="20" />
    </button>
</template>

<style scoped>
.row-more {
    display: flex;
    flex: none;
    align-items: center;
    justify-content: center;
    width: 48px;
    height: 48px;
    margin: -10px -14px -10px 0;
    border: 0;
    border-radius: 12px;
    background: none;
    color: var(--text-2);
}

.row-more:active {
    background: var(--hover);
}
</style>
