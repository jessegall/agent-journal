<script setup>
defineProps({title: {type: String, default: ""}, count: {type: String, default: ""}});
</script>

<template>
    <div class="col">
        <template v-if="title">
            <div class="head">
                {{ title }}
                <template v-if="count">
                    <span class="count">{{ count }}</span>
                </template>
                <span class="grow" />
                <slot name="end" />
            </div>
        </template>
        <div class="col-body"><slot /></div>
    </div>
</template>

<style scoped>
.col {
    display: flex;
    flex-direction: column;
    min-width: 0;
    min-height: 0;
}

.col + .col {
    border-left: 1px solid var(--border);
}

.head {
    display: flex;
    flex: none;
    align-items: center;
    gap: 8px;
    height: 34px;
    padding: 0 16px;
    color: var(--text-2);
    font-size: 12.5px;
    font-weight: 500;
}

.count {
    color: var(--text-4);
    font-weight: 400;
}

.grow {
    flex: 1;
}

.col-body {
    display: flex;
    flex: 1;
    flex-direction: column;
    min-height: 0;
    overflow-y: auto;
    scrollbar-width: thin;
}
</style>
