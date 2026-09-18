<script setup>
import {computed} from "vue";
import Icon from "../kit/Icon.vue";
import {go, route} from "../route.js";
import {meta, types, unreadByUser} from "../store.js";

const TINT = {
    question: "#a78bfa",
    plan: "#5b8def",
    report: "#3ecf74",
    doc: "#8b8e96",
    pin: "#d9a441",
    rule: "#d9a441",
    reminder: "#d9a441",
};
const cards = computed(() => types.value.filter((t) => t.attention).flatMap((t) => unreadByUser(t.name)));
</script>

<template>
    <template v-if="!cards.length">
        <div class="home-rail-empty">
            <Icon name="todos" />
            <p>Nothing is waiting on you.</p>
        </div>
    </template>
    <template v-else>
        <section class="home-section">
            <div class="needs-slot">
                <template v-for="r in cards" :key="r.ref">
                    <div
                        :class="['needs-card', r.type]"
                        :style="{'--tint': TINT[r.type] || 'var(--text-3)'}"
                        @click="go(route.env, r.type, r.n)"
                    >
                        <div class="needs-card-top">
                            <span class="needs-card-kind">{{ meta(r.type).title }}</span>
                            <span class="needs-card-meta">{{ r.type }} {{ r.n }}</span>
                        </div>
                        <p class="needs-card-title">{{ r.title }}</p>
                        <template v-if="r.abstract">
                            <p class="needs-card-text">{{ r.abstract }}</p>
                        </template>
                        <div class="needs-card-foot">
                            <button type="button" class="needs-card-go">Open</button>
                        </div>
                    </div>
                </template>
            </div>
        </section>
    </template>
</template>

<style scoped>
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
    background: var(--tint);
    opacity: 0.7;
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
    color: var(--tint);
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

.needs-card-foot {
    display: flex;
    align-items: center;
}

.needs-card-go {
    flex: 1 0 100%;
    height: auto;
    margin-top: 2px;
    padding: 6px 10px;
    border: none;
    border-radius: 6px;
    background: color-mix(in srgb, var(--tint) 16%, transparent);
    color: var(--tint);
    font-size: 12px;
    font-weight: 500;
    cursor: pointer;
}

.needs-card-go:hover {
    background: color-mix(in srgb, var(--tint) 26%, transparent);
}
</style>
