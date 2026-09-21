<script setup>
import Card from "./Card.vue";

defineProps({lane: Object, loading: Boolean});
</script>

<template>
    <section class="lane">
        <header class="head">
            <span class="title">{{ lane.title }}</span>
            <span class="count">{{ loading ? "" : lane.cards.length }}</span>
        </header>
        <div class="cards">
            <template v-if="loading">
                <template v-for="i in 3" :key="i">
                    <div class="skeleton">
                        <span class="blank short" />
                        <span class="blank" />
                    </div>
                </template>
            </template>
            <template v-else-if="lane.cards.length">
                <template v-for="card in lane.cards" :key="card.n">
                    <Card :card="card" />
                </template>
            </template>
            <template v-else>
                <p class="none">No cards</p>
            </template>
        </div>
    </section>
</template>

<style scoped>
.lane {
    display: flex;
    flex: 0 0 264px;
    flex-direction: column;
    min-height: 0;
    border: 1px solid var(--border);
    border-radius: 12px;
    background: var(--side);
}

.head {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 10px 12px;
    border-bottom: 1px solid var(--line);
}

.title {
    font-size: 12.5px;
    font-weight: 600;
}

.count {
    color: var(--text-3);
    font-size: 12px;
}

.cards {
    display: flex;
    flex-direction: column;
    gap: 8px;
    overflow-y: auto;
    padding: 10px;
}

.none {
    margin: 6px 2px;
    color: var(--text-3);
    font-size: 12px;
}

.skeleton {
    display: flex;
    flex-direction: column;
    gap: 8px;
    padding: 12px;
    border: 1px solid var(--border);
    border-radius: 9px;
    animation: skeleton-wait 1.6s ease-in-out infinite;
}

.blank {
    display: block;
    height: 10px;
    border-radius: 99px;
    background: color-mix(in srgb, var(--text-3) 22%, transparent);
}

.blank.short {
    width: 30%;
}

@keyframes skeleton-wait {
    50% {
        opacity: 0.55;
    }
}
</style>
