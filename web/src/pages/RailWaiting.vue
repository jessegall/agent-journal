<script setup>
import {computed} from "vue";
import Icon from "../kit/Icon.vue";
import {act} from "../api.js";
import {peek, route} from "../route.js";
import {age, focusTurn, meta, types, unreadByUser} from "../store.js";

const TINT = {
    question: "var(--blocking)",
    plan: "var(--progress)",
    report: "var(--open)",
    doc: "var(--open)",
    pin: "var(--open)",
    rule: "var(--open)",
    reminder: "var(--open)",
};
const cards = computed(() =>
    types.value
        .filter((t) => t.attention)
        .flatMap((t) => unreadByUser(t.name))
        .sort((a, b) => b.created - a.created)
);

function open(r) {
    if (!focusTurn(r.ref)) peek(r.type, r.n);
}

async function dismiss(r) {
    await act(route.value.env, r.type, r.n, "read");
}
</script>

<template>
    <template v-if="!cards.length">
        <div class="home-rail-empty">
            <Icon name="todos" />
            <p>No highlights to review.</p>
        </div>
    </template>
    <template v-else>
        <section class="home-section">
            <TransitionGroup name="qrow" tag="div" class="needs-slot">
                <div v-for="r in cards" :key="r.ref" :class="['needs-card', r.type]" @click="open(r)">
                    <div class="needs-card-top">
                        <span class="needs-card-kind">{{ meta(r.type).title }}</span>
                        <template v-if="meta(r.type).clears !== 'completed' || r.completed">
                            <button type="button" class="needs-dismiss" title="Seen — take it off the list" @click.stop="dismiss(r)">
                                <Icon name="close" />
                            </button>
                        </template>
                    </div>
                    <p class="needs-card-title">{{ r.title }}</p>
                    <template v-if="r.abstract">
                        <p class="needs-card-text">{{ r.abstract }}</p>
                    </template>
                    <p class="needs-card-foot">
                        <span class="needs-card-meta">{{ r.type }} {{ r.n }}</span>
                        <span class="needs-card-when">{{ age(r.created) || "just now" }}</span>
                    </p>
                </div>
            </TransitionGroup>
        </section>
    </template>
</template>

<style scoped>
.qrow-enter-active {
    transition:
        opacity 0.24s ease-out,
        transform 0.24s cubic-bezier(0.2, 0.8, 0.2, 1);
}

.qrow-enter-from {
    opacity: 0;
    transform: translateY(-8px);
}

.qrow-leave-active {
    position: absolute;
    left: 0;
    right: 0;
    transition:
        opacity 0.16s ease-in,
        transform 0.16s ease-in;
}

.qrow-leave-to {
    opacity: 0;
    transform: translateY(8px);
}

.qrow-move {
    transition: transform 0.28s cubic-bezier(0.2, 0.8, 0.2, 1);
}

.home-rail-empty {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 7px;
    padding: 34px 18px 0;
    text-align: center;
    color: var(--text-3);
}

.home-rail-empty p {
    margin: 0;
    font-size: 11.5px;
}

.home-rail-empty .ico {
    width: 20px;
    height: 20px;
    opacity: 0.5;
}

.needs-slot {
    position: relative;
    display: flex;
    flex-direction: column;
}

.needs-card {
    position: relative;
    display: flex;
    flex-direction: column;
    gap: 5px;
    padding: 10px var(--rail-gutter) 10px 14px;
    border-bottom: 1px solid var(--border);
    cursor: pointer;
    overflow: hidden;
}

.needs-card::before {
    content: "";
    position: absolute;
    left: 0;
    top: 0;
    bottom: 0;
    width: 2px;
    background: var(--text-3);
    opacity: 0.5;
}

.needs-card:hover {
    background: #191a1e;
}

.needs-card:hover::before {
    opacity: 1;
}

.needs-card.question::before {
    width: 3px;
    opacity: 0.9;
}

.needs-card.question .needs-card-title {
    color: var(--text);
    font-weight: 500;
}

.needs-card-top {
    display: flex;
    align-items: baseline;
    gap: 9px;
}

.needs-card-kind {
    flex: none;
    font-size: 10.5px;
    font-weight: 600;
    letter-spacing: 0.06em;
    text-transform: uppercase;
    color: var(--text-3);
}

.needs-dismiss {
    flex: none;
    width: 26px;
    height: 26px;
    margin: -4px -6px -4px auto;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    padding: 0;
    border: none;
    border-radius: 6px;
    background: transparent;
    color: var(--text-3);
    cursor: pointer;
}

.needs-dismiss:hover {
    background: #212329;
    color: var(--text-2);
}

.needs-dismiss .ico {
    width: 12px;
    height: 12px;
}

.needs-card-foot {
    display: flex;
    align-items: center;
    gap: 8px;
    margin: 6px 0 0;
}

.needs-card-when {
    font-size: 11px;
    color: var(--text-3);
    white-space: nowrap;
}

.needs-card-meta {
    min-width: 0;
    font-size: 11px;
    color: var(--text-3);
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
}

.needs-card-title {
    margin: 0;
    font-size: 13px;
    line-height: 1.45;
    color: var(--text-2);
}

.needs-card-text {
    margin: 0;
    font-size: 12px;
    line-height: 1.45;
    color: var(--text-3);
}
</style>
