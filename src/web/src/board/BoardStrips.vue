<script setup>
defineProps({refusal: {type: String, default: ""}, hold: {type: String, default: ""}});
</script>

<template>
    <div class="strips">
        <slot />
        <template v-if="refusal">
            <p class="refusal">{{ refusal }}</p>
        </template>
        <template v-if="hold">
            <p class="hold">{{ hold }}</p>
        </template>
    </div>
</template>

<style scoped>
.strips {
    display: flex;
    flex: none;
    flex-direction: column;
    gap: 10px;
    padding: 12px 20px 0;
}

.strips:empty {
    display: none;
}

.refusal {
    margin: 0;
    color: var(--danger);
    font-size: 12.5px;
}

.hold {
    margin: 0;
    padding: 8px 12px;
    border: 1px solid var(--border);
    border-radius: 9px;
    background: var(--raised);
    color: var(--text-2);
    font-size: 12.5px;
}
</style>
