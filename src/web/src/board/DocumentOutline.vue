<script setup>
defineProps({sections: {type: Array, required: true}, lit: {type: String, default: ""}});

const MARKS = {"": "·", now: "", read: "✓", out: "–", asked: "?"};
const count = (section) => {
    if (section.state === "out") return "left out";
    if (section.state === "asked") return "asked";
    if (section.state === "read" && section.drafts) return String(section.drafts);
    return "";
};
</script>

<template>
    <ol class="outline">
        <template v-for="section in sections" :key="section.title">
            <li :class="['section', section.state || 'todo', {lit: section.title === lit}]">
                <Transition name="mark" mode="out-in">
                    <span :key="section.state" class="mark">{{ MARKS[section.state] ?? "·" }}</span>
                </Transition>
                <span class="title">{{ section.title }}</span>
                <span class="count">{{ count(section) }}</span>
            </li>
        </template>
    </ol>
</template>

<style scoped>
.outline {
    display: flex;
    flex-direction: column;
    gap: 2px;
    margin: 0;
    padding: 0;
    list-style: none;
}

.section {
    display: grid;
    grid-template-columns: 18px minmax(0, 1fr) auto;
    align-items: center;
    gap: 8px;
    height: 30px;
    padding: 0 10px 0 8px;
    border-radius: 7px;
    color: var(--text-2);
    font-size: 13px;
    transition:
        background var(--fade),
        color var(--fade);
}

.title {
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
}

.mark {
    display: flex;
    justify-content: center;
    color: var(--text-4);
    font-size: 12px;
}

.count {
    color: var(--text-3);
    font-size: 12px;
    font-variant-numeric: tabular-nums;
}

.todo {
    color: var(--text-3);
}

.read .mark {
    color: var(--tone-good);
}

.now {
    background: color-mix(in srgb, var(--accent) 10%, transparent);
    color: var(--text);
}

.now .mark::before {
    width: 7px;
    height: 7px;
    border-radius: 50%;
    background: var(--accent);
    animation: breathe 1.8s ease-in-out infinite;
    content: "";
}

.out {
    color: var(--text-4);
}

.out .title {
    text-decoration: line-through;
    text-decoration-color: var(--text-4);
}

.asked .mark,
.asked .count {
    color: var(--tone-warn);
}

.lit {
    background: color-mix(in srgb, var(--accent) 18%, transparent);
    color: var(--text);
    box-shadow: inset 2px 0 0 var(--accent);
}

.mark-enter-active {
    transition:
        opacity var(--fade),
        transform var(--move);
}

.mark-leave-active {
    transition: opacity 0.15s;
}

.mark-enter-from {
    opacity: 0;
    transform: scale(0.5);
}

.mark-leave-to {
    opacity: 0;
}

@keyframes breathe {
    50% {
        opacity: 0.35;
        transform: scale(0.7);
    }
}

@media (prefers-reduced-motion: reduce) {
    .now .mark::before {
        animation: none;
    }
}
</style>
