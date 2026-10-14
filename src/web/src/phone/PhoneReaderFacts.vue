<script setup>
import TextDisplay from "../kit/TextDisplay.vue";

defineProps({facts: {type: Array, required: true}, after: {type: Array, required: true}});
</script>

<template>
    <dl class="reader-facts">
        <template v-for="fact in facts" :key="fact.label">
            <div class="reader-fact">
                <dt>{{ fact.label }}</dt>
                <template v-if="fact.text">
                    <dd><TextDisplay :text="fact.value" inline /></dd>
                </template>
                <template v-else>
                    <dd>{{ fact.value }}</dd>
                </template>
            </div>
        </template>
        <template v-if="after.length">
            <div class="reader-fact">
                <dt>Waits on</dt>
                <dd>
                    <template v-for="ref in after" :key="ref">
                        <a class="reader-chip" href="#" :data-peek="ref">{{ ref.replace(":", " ") }}</a>
                    </template>
                </dd>
            </div>
        </template>
    </dl>
</template>

<style scoped>
.reader-facts {
    margin: 0 0 16px;
    padding: 0;
    overflow: hidden;
    border-radius: 12px;
    background: var(--raised);
    font-size: 1rem;
}

.reader-fact {
    display: flex;
    flex-wrap: wrap;
    justify-content: space-between;
    gap: 4px 12px;
    min-height: 44px;
    padding: 11px 16px;
}

.reader-fact + .reader-fact {
    border-top: 1px solid var(--line);
}

.reader-fact dt {
    color: var(--text-2);
}

.reader-fact dd {
    display: flex;
    flex-wrap: wrap;
    gap: 6px;
    margin: 0;
    color: var(--text);
    text-align: right;
}

.reader-chip {
    max-width: 100%;
    overflow-wrap: anywhere;
    padding: 1px 8px;
    border-radius: 9px;
    background: var(--hover);
    color: var(--accent-text);
    text-decoration: none;
}
</style>
