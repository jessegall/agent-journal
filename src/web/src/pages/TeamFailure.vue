<script setup>
import "./team.css";

defineProps({text: {type: String, required: true}});
</script>

<template>
    <div class="team-block">
        <p class="team-failure">{{ text }}</p>
    </div>
</template>
