<script setup>
import Icon from "../kit/Icon.vue";

defineProps({abilities: {type: Object, required: true}});
</script>

<template>
    <section class="abilities" aria-label="What you can do">
        <h3 class="heading">You can</h3>
        <template v-for="text in abilities.can" :key="text">
            <p class="ability"><Icon name="tick" :size="13" />{{ text }}</p>
        </template>
        <template v-if="abilities.cannot.length">
            <h3 class="heading">You can't</h3>
            <template v-for="limit in abilities.cannot" :key="limit.text">
                <p class="ability limited"><Icon name="close" :size="13" />{{ limit.text }}. {{ limit.why }}</p>
            </template>
        </template>
    </section>
</template>

<style scoped>
.abilities {
    display: grid;
    gap: 6px;
}

.heading {
    margin: 4px 0 0;
    font-size: 12px;
    font-weight: 600;
    color: var(--text-3);
}

.ability {
    display: flex;
    align-items: baseline;
    gap: 8px;
    margin: 0;
    font-size: 13px;
}

.limited {
    color: var(--text-3);
}
</style>
