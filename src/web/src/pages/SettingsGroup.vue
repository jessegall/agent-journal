<script setup>
defineProps({shut: {type: Boolean, default: false}});
const emit = defineEmits(["fold"]);
</script>

<template>
    <section :class="['group', {shut}]">
        <header class="group-head" role="button" tabindex="0" @click="emit('fold')">
            <span class="fold" />
            <h2><slot name="title" /></h2>
            <template v-if="!shut">
                <p class="lead"><slot name="lead" /></p>
            </template>
        </header>
        <template v-if="!shut">
            <slot />
        </template>
    </section>
</template>

<style scoped>
.group + .group {
    margin-top: 32px;
}

.group-head {
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    gap: 8px;
    margin-bottom: 4px;
    padding: 6px 8px 6px 4px;
    border-radius: 8px;
    cursor: pointer;
    user-select: none;
}

.group-head:hover {
    background: var(--hover);
}

.fold {
    flex: none;
    width: 0;
    height: 0;
    border-top: 5px solid transparent;
    border-bottom: 5px solid transparent;
    border-left: 7px solid var(--text-3);
    transform: rotate(90deg);
    transition: transform 0.15s ease;
}

.group.shut .fold {
    transform: rotate(0deg);
}

.group-head:hover .fold {
    border-left-color: var(--text);
}

.lead {
    flex-basis: 100%;
    padding-left: 19px;
}

h2 {
    margin: 0 0 3px;
    font-size: 15px;
    font-weight: 600;
}

.lead {
    margin: 0;
    color: var(--text-3);
    font-size: 12.5px;
}
</style>
