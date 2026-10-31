<script setup>
defineProps({reactions: {type: Array, required: true}});
const emit = defineEmits(["react"]);
</script>

<template>
    <div class="thread-faces">
        <template v-for="reaction in reactions" :key="reaction.emoji">
            <button type="button" :class="['thread-face', {mine: reaction.mine}]" :title="reaction.title" @click.stop="emit('react', reaction.emoji)">
                {{ reaction.emoji }}
                <template v-if="reaction.n > 1">
                    <span class="thread-face-n">{{ reaction.n }}</span>
                </template>
            </button>
        </template>
    </div>
</template>

<style scoped>
.thread-faces {
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    gap: 4px;
    margin-top: 2px;
}

.thread-face {
    display: inline-flex;
    align-items: center;
    gap: 3px;
    padding: 1px 6px;
    border: 1px solid transparent;
    border-radius: 20px;
    background: transparent;
    font-size: 12px;
    line-height: 18px;
    cursor: pointer;
    transition:
        background 0.15s,
        border-color 0.15s;
}

.thread-face:hover {
    background: var(--hover);
}

.thread-face.mine {
    border-color: color-mix(in srgb, var(--accent) 60%, transparent);
    background: color-mix(in srgb, var(--accent) 16%, var(--raised));
}

.thread-face-n {
    font-size: 10.5px;
    color: var(--text-3);
    font-variant-numeric: tabular-nums;
}
</style>
