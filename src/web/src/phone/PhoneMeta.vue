<script setup>
import {clock} from "../format/time.js";
import PhoneTicks from "./PhoneTicks.vue";

defineProps({item: {type: Object, required: true}, elsewhere: {type: Boolean, default: false}});
</script>

<template>
    <span class="turn-meta">
        <template v-if="elsewhere">from desktop ·</template>
        {{ clock(item.created) }}
        <PhoneTicks :message="item" />
    </span>
</template>

<style scoped>
.turn-meta {
    display: flex;
    width: 100%;
    align-items: center;
    justify-content: flex-end;
    gap: 4px;
    margin-top: 4px;
    color: var(--text-2);
    font-size: 0.706rem;
    padding-right: 26px;
}
</style>
