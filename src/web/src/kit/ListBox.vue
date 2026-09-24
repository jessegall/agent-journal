<script setup>
defineProps({
    title: {type: String, required: true},
    count: {type: [Number, String], default: ""},
    lead: {type: String, default: ""},
    folds: Boolean,
    open: {type: Boolean, default: true},
});
const emit = defineEmits(["toggle"]);
</script>

<template>
    <section class="list-box">
        <component
            :is="folds ? 'button' : 'header'"
            :type="folds ? 'button' : undefined"
            :class="['list-box-head', {folds}]"
            :aria-expanded="folds ? open : undefined"
            @click="folds && emit('toggle')"
        >
            <span class="list-box-title">{{ title }}</span>
            <template v-if="count !== ''">
                <span class="list-box-count">{{ count }}</span>
            </template>
            <template v-if="folds">
                <span :class="['list-box-mark', {shut: !open}]" />
            </template>
        </component>
        <template v-if="open">
            <div class="list-box-rows">
                <template v-if="lead">
                    <p class="list-box-lead">{{ lead }}</p>
                </template>
                <slot />
            </div>
        </template>
    </section>
</template>

<style scoped>
.list-box-head {
    display: flex;
    align-items: center;
    gap: 8px;
    width: 100%;
    height: 34px;
    padding: 0 16px;
    border: 0;
    border-bottom: 1px solid var(--border);
    background: var(--bg-2);
    color: var(--text-3);
    font: inherit;
    font-size: 11.5px;
    letter-spacing: 0.03em;
    text-align: left;
}

.list-box-head.folds {
    cursor: pointer;
}

.list-box-head.folds:hover {
    color: var(--text-2);
}

.list-box-title {
    color: var(--text-2);
}

.list-box-count {
    font-variant-numeric: tabular-nums;
}

.list-box-mark {
    width: 5px;
    height: 5px;
    margin: 0 2px 0 auto;
    border-right: 1.5px solid currentColor;
    border-bottom: 1.5px solid currentColor;
    opacity: 0.7;
    transform: rotate(45deg);
    transition: transform 0.15s;
}

.list-box-mark.shut {
    transform: rotate(-45deg);
}

.list-box-lead {
    margin: 0;
    padding: 10px 16px;
    color: var(--text-3);
    font-size: 12px;
    line-height: 1.45;
}

.list-box-rows > :deep(*) {
    border-bottom: 1px solid var(--border);
}
</style>
