<script setup>
defineProps({renewals: {type: Array, default: () => []}});
</script>

<template>
    <template v-if="renewals.length">
        <section class="block-history" data-task-block-history>
            <h3>Block history</h3>
            <template v-for="renewal in renewals" :key="renewal.id">
                <article data-task-block-renewal>
                    <time :datetime="renewal.created_at">{{ new Date(renewal.created_at).toLocaleString() }}</time>
                    <p>{{ renewal.reason }}</p>
                </article>
            </template>
        </section>
    </template>
</template>

<style scoped>
.block-history {
    margin-top: 18px;
}
h3 {
    font-size: 12px;
    color: var(--text-3);
}
article {
    margin-top: 12px;
}
time {
    font-size: 11px;
    color: var(--text-3);
}
p {
    margin: 4px 0;
    white-space: pre-wrap;
}
</style>
