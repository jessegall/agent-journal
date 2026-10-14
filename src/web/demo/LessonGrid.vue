<script setup>
import Btn from "../src/kit/Btn.vue";
import facts from "virtual:lesson-facts";
import {lengthLine} from "./pacing.js";
import {LESSONS, play} from "./scenarios.js";

const REPOSITORY = "https://github.com/jessegall/agent-journal";
const open = (url) => window.open(url, "_blank", "noopener");
</script>

<template>
    <main class="lessons">
        <div class="lessons-page">
            <header class="lessons-head">
                <h1>Learn the journal by using it</h1>
                <p>
                    Each lesson is a real session recorded through the journal, with every feature on. You play the user: send each message,
                    answer each question, approve each plan, and the journal does what it really does.
                </p>
            </header>
            <div class="lessons-grid">
                <template v-for="lesson in LESSONS" :key="lesson.key">
                    <button type="button" class="lesson" @click="play(lesson.key)">
                        <span class="lesson-title">{{ lesson.title }}</span>
                        <span class="lesson-teaches">{{ lesson.teaches }}</span>
                        <span class="lesson-length">{{ lengthLine(facts[lesson.key]) }}</span>
                        <span class="lesson-start">Start this lesson</span>
                    </button>
                </template>
            </div>
            <footer class="lessons-foot">
                <span>Nothing leaves your browser.</span>
                <Btn small @click="open(`${REPOSITORY}#install`)">Install</Btn>
                <Btn small @click="open(REPOSITORY)">View on GitHub</Btn>
            </footer>
        </div>
    </main>
</template>

<style scoped>
.lessons {
    height: 100%;
    overflow-y: auto;
    background: var(--bg);
    color: var(--text);
}

.lessons-page {
    display: flex;
    flex-direction: column;
    gap: 28px;
    box-sizing: border-box;
    max-width: 880px;
    margin: 0 auto;
    padding: 56px 24px 32px;
}

.lessons-head h1 {
    margin: 0 0 10px;
    font-size: 26px;
    font-weight: 600;
}

.lessons-head p {
    max-width: 640px;
    margin: 0;
    color: var(--text-2);
    font-size: 14px;
    line-height: 1.55;
}

.lessons-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
    gap: 14px;
}

.lesson {
    display: flex;
    flex-direction: column;
    gap: 10px;
    padding: 18px 18px 16px;
    border: 1px solid var(--border);
    border-radius: 12px;
    background: var(--raised);
    color: inherit;
    font: inherit;
    text-align: left;
    cursor: pointer;
    transition: border-color 0.15s;
}

.lesson:hover,
.lesson:focus-visible {
    border-color: var(--accent);
    outline: none;
}

.lesson-title {
    font-size: 15.5px;
    font-weight: 600;
}

.lesson-teaches {
    flex: 1;
    color: var(--text-2);
    font-size: 13px;
    line-height: 1.55;
}

.lesson-length {
    color: var(--text);
    font-size: 12px;
    font-weight: 600;
}

.lesson-start {
    color: var(--accent-text);
    font-size: 12.5px;
    font-weight: 500;
}

.lessons-foot {
    display: flex;
    align-items: center;
    gap: 8px;
    margin-top: auto;
    color: var(--text-3);
    font-size: 12px;
}

.lessons-foot span {
    margin-right: auto;
}

@media (max-width: 640px) {
    .lessons {
        padding: 32px 16px 24px;
    }

    .lessons-head h1 {
        font-size: 22px;
    }
}
</style>
