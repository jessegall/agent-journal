<script setup>
import {computed} from "vue";
import {store} from "../store.js";

const title = computed(() => `${store.identity.project} project color`);
</script>

<template>
    <div class="identity-band" :style="{background: store.identity.color}" :title="title" />
</template>

<style scoped>
.identity-band {
    height: 4px;
    flex: none;
}
</style>
