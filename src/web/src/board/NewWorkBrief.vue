<script setup>
defineProps({goal: {type: String, default: ""}, doneWhen: {type: Array, required: true}, missing: {type: Array, required: true}});
</script>

<template>
    <div class="brief">
        <template v-if="goal">
            <p class="brief-goal">{{ goal }}</p>
        </template>
        <template v-if="doneWhen.length">
            <ol class="brief-done">
                <template v-for="clause in doneWhen" :key="clause">
                    <li :class="{missing: missing.includes(clause)}">{{ clause }}</li>
                </template>
            </ol>
        </template>
    </div>
</template>

<style scoped>
.brief {
    display: flex;
    flex-direction: column;
    gap: 6px;
    margin-bottom: 14px;
    padding: 12px 14px;
    border: 1px solid var(--border);
    border-radius: 10px;
}

.brief-goal {
    margin: 0;
    color: var(--text);
    font-weight: 500;
}

.brief-done {
    display: flex;
    flex-direction: column;
    gap: 2px;
    margin: 0;
    padding-left: 18px;
    color: var(--text-2);
    font-size: 12.5px;
}

.brief-done li.missing {
    color: var(--warn, var(--blocking));
}
</style>
