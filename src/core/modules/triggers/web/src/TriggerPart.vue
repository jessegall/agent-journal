<script setup>
// one titled part of the trigger dialog
defineProps({title: {type: String, required: true}, hint: {type: String, required: true}});
</script>

<template>
    <section class="part">
        <div class="part-head"><h5>{{ title }}</h5><span>{{ hint }}</span></div>
        <slot />
    </section>
</template>

<style scoped>
.part {
    display: flex;
    flex-direction: column;
    gap: 12px;
}

.part-head {
    display: flex;
    flex-wrap: wrap;
    gap: 10px;
    align-items: baseline;
    color: var(--text-3);
    font-size: 12px;
}

.part-head h5 {
    margin: 0;
    color: var(--text);
    font-size: 13.5px;
    font-weight: 600;
}
</style>
