<script setup>
import {computed, ref} from "vue";
import Btn from "../src/kit/Btn.vue";
import {following, lessons, play, scenario} from "./scenarios.js";
import {restart} from "./storage.js";

const props = defineProps({player: {type: Object, required: true}});

const looking = ref(false);
const shown = computed(() => props.player.view.ended && !looking.value);
</script>

<template>
    <Teleport to="body">
        <template v-if="shown">
            <section class="lesson-end" aria-label="Lesson done">
                <h2>Lesson done</h2>
                <p>{{ scenario.done }}</p>
                <div class="lesson-end-acts">
                    <Btn small @click="looking = true">Look around</Btn>
                    <Btn small @click="restart">Watch again</Btn>
                    <template v-if="following">
                        <Btn small class="primary" @click="play(following.key)">Next lesson</Btn>
                    </template>
                    <Btn small @click="lessons">All lessons</Btn>
                </div>
            </section>
        </template>
    </Teleport>
</template>

<style scoped>
.lesson-end {
    position: fixed;
    right: 16px;
    bottom: 16px;
    left: 16px;
    z-index: 9000;
    box-sizing: border-box;
    max-width: 380px;
    margin: 0 auto;
    padding: 14px 16px;
    border: 1px solid var(--border-2);
    border-radius: 12px;
    background: var(--bg-2);
    color: var(--text);
    box-shadow: 0 12px 32px rgba(0, 0, 0, 0.35);
    animation: lesson-end-in 0.25s var(--ease) both;
}

h2 {
    margin: 0 0 6px;
    font-size: 15px;
    font-weight: 600;
}

p {
    margin: 0 0 12px;
    color: var(--text-2);
    font-size: 13px;
    line-height: 1.5;
}

.lesson-end-acts {
    display: flex;
    flex-wrap: wrap;
    gap: 6px;
}

@keyframes lesson-end-in {
    from {
        opacity: 0;
        transform: translateY(8px);
    }
}
</style>
