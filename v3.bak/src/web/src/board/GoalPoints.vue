<script setup>
defineProps({goal: {type: String, default: ""}, points: {type: Array, required: true}});
</script>

<template>
    <template v-if="goal">
        <p class="goal-whole">{{ goal }}</p>
    </template>
    <template v-if="points.length">
        <ol class="goal-points">
            <template v-for="point in points" :key="point">
                <li>{{ point }}</li>
            </template>
        </ol>
    </template>
</template>
