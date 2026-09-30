<script setup>
import {plain} from "./plain.js";

const FACES = ["👍", "❤️", "🎉", "😄", "👀", "🙏", "👎", "💔", "😠", "🎩"];
defineProps({item: {type: Object, required: true}});
const emit = defineEmits(["react", "reply", "copy", "close"]);
</script>

<template>
    <div class="hold-backdrop" @click="emit('close')">
        <div class="hold-sheet" role="menu" aria-label="Message actions" @click.stop>
            <p class="hold-quote">{{ plain(item.brief || item.title) }}</p>
            <div class="hold-faces">
                <template v-for="face in FACES" :key="face">
                    <button type="button" class="hold-face" :aria-label="`React ${face}`" @click="emit('react', face)">{{ face }}</button>
                </template>
            </div>
            <button type="button" class="hold-action" role="menuitem" @click="emit('reply')">Reply</button>
            <button type="button" class="hold-action" role="menuitem" @click="emit('copy')">Copy</button>
            <button type="button" class="hold-action quiet" role="menuitem" @click="emit('close')">Cancel</button>
        </div>
    </div>
</template>

<style scoped>
.hold-backdrop {
    position: fixed;
    inset: 0;
    z-index: 20;
    display: flex;
    align-items: flex-end;
    max-width: none;
    background: rgb(0 0 0 / 45%);
}

.hold-sheet {
    display: flex;
    flex-direction: column;
    gap: 4px;
    width: 100%;
    max-width: none;
    padding: 14px 16px calc(14px + env(safe-area-inset-bottom));
    border-radius: 16px 16px 0 0;
    background: var(--raised);
}

.hold-quote {
    display: -webkit-box;
    margin: 0 0 8px;
    overflow: hidden;
    color: var(--text-2);
    font-size: 14px;
    -webkit-line-clamp: 3;
    -webkit-box-orient: vertical;
}

.hold-faces {
    display: flex;
    gap: 8px;
    margin: 0 -16px 6px;
    padding: 0 16px 4px;
    max-width: none;
    overflow-x: auto;
    overscroll-behavior-x: contain;
    scrollbar-width: none;
    -webkit-overflow-scrolling: touch;
}

.hold-faces::-webkit-scrollbar {
    display: none;
}

.hold-face {
    flex: none;
    width: 48px;
    height: 48px;
    border: 0;
    border-radius: 50%;
    background: var(--hover);
    font-size: 24px;
}

.hold-action {
    min-height: 48px;
    border: 0;
    border-radius: 10px;
    background: none;
    color: var(--text);
    font: inherit;
    text-align: left;
    padding: 0 8px;
}

.hold-action.quiet {
    color: var(--text-3);
}
</style>
