<script setup>
// how far a running check has come; before its command says anything the bar slides, since nobody can tell yet
defineProps({percent: {type: Number, required: true}});
</script>

<template>
    <span class="check-bar" data-check-progress>
        <span :class="['check-bar-fill', {sliding: !percent}]" :style="percent ? {width: `${percent}%`} : {}" />
    </span>
</template>

<style scoped>
.check-bar {
    display: block;
    overflow: hidden;
    height: 3px;
    border-radius: 2px;
    background: var(--hover);
}

.check-bar-fill {
    display: block;
    height: 100%;
    border-radius: 2px;
    background: var(--accent);
    transition: width 0.5s ease;
}

.check-bar-fill.sliding {
    width: 30%;
    animation: check-bar-slide 1.2s ease-in-out infinite alternate;
}

@keyframes check-bar-slide {
    from {
        transform: translateX(0);
    }

    to {
        transform: translateX(233%);
    }
}
</style>
