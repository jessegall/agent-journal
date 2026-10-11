<script setup>
import {computed, ref, watch} from "vue";
import {api} from "../api/client.js";

const props = defineProps({fact: {type: String, default: ""}, over: {type: Number, default: 0}, text: {type: String, default: ""}});
const found = ref(null);
const refused = ref("");
let asked = 0;

const heading = computed(() => {
    const {matching, capped} = found.value;
    if (capped) return `At least ${matching} match right now. The trigger names the ${matching} that have waited longest at a time.`;
    return matching === 1 ? "1 matches right now." : `${matching} match right now.`;
});

watch(
    () => [props.fact, props.over, props.text],
    async () => {
        const mine = ++asked;
        found.value = null;
        refused.value = "";
        try {
            const got = await api.triggerMatching(props.fact, props.over, props.text || null);
            if (mine === asked) found.value = got;
        } catch (e) {
            if (mine === asked) refused.value = `${e.message.charAt(0).toUpperCase()}${e.message.slice(1)}`;
        }
    },
    {immediate: true}
);
</script>

<template>
    <div class="matches" aria-live="polite">
        <template v-if="refused">
            <p class="note">{{ refused }}</p>
        </template>
        <template v-else-if="!found">
            <p class="note">Checking what this matches right now.</p>
        </template>
        <template v-else-if="!found.matching">
            <p class="note">Nothing matches this right now.</p>
        </template>
        <template v-else>
            <p class="count">{{ heading }}</p>
            <ul class="rows">
                <template v-for="(title, i) in found.rows" :key="i">
                    <li class="row">
                        <span class="row-title">{{ title }}</span>
                        <template v-if="found.says[i]">
                            <span class="row-says">{{ found.says[i] }}</span>
                        </template>
                    </li>
                </template>
            </ul>
        </template>
    </div>
</template>

<style scoped>
.matches {
    display: flex;
    flex-direction: column;
    gap: 6px;
}

.note,
.count {
    margin: 0;
    font-size: 13px;
    line-height: 1.5;
}

.note {
    color: var(--text-3);
}

.count {
    color: var(--text);
}

.rows {
    display: flex;
    flex-direction: column;
    gap: 4px;
    margin: 0;
    padding: 0;
    list-style: none;
}

.row {
    display: flex;
    flex-direction: column;
    gap: 2px;
    padding: 6px 8px;
    border: 1px solid var(--border-2);
    border-radius: 8px;
    background: var(--bg-2);
}

.row-title {
    color: var(--text);
    font-size: 13px;
}

.row-says {
    color: var(--text-3);
    font-size: 12px;
}
</style>
