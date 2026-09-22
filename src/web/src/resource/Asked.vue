<script setup>
import SectionHeading from "../kit/SectionHeading.vue";
import TextDisplay from "../kit/TextDisplay.vue";
import {computed, ref, watch} from "vue";
import OptionsPicker from "./OptionsPicker.vue";
import {api} from "../api/client.js";
import {linkedTo} from "../domain/records.js";
import {meta} from "../state/store.js";

const props = defineProps({resource: Object});
const asking = (r) => meta(r.type).fields.options && meta(r.type).needs_attention;
const live = computed(() => linkedTo(props.resource.ref).filter(asking));
const earlier = ref([]);
watch(
    () => props.resource.ref,
    async (about) => {
        earlier.value = [];
        const found = await api.command("question", "linked_to", {ref: about}).catch(() => []);
        if (about === props.resource.ref) earlier.value = found;
    },
    {immediate: true}
);
const questions = computed(() => {
    const held = new Set(live.value.map((q) => q.ref));
    return [...live.value, ...earlier.value.filter((q) => !held.has(q.ref))].sort((a, b) => !!a.completed - !!b.completed || b.n - a.n);
});
</script>

<template>
    <template v-if="questions.length">
        <section class="asked">
            <SectionHeading>Questions in this {{ meta(resource.type).title.toLowerCase() }}</SectionHeading>
            <template v-for="q in questions" :key="q.ref">
                <div :class="['asked-one', {done: q.completed}]">
                    <p class="asked-text">{{ q.title }}</p>
                    <template v-if="q.abstract">
                        <TextDisplay class="asked-context" :text="q.abstract" />
                    </template>
                    <OptionsPicker :resource="q" />
                </div>
            </template>
        </section>
    </template>
</template>

<style scoped>
.asked {
    margin-top: 20px;
}

h3 {
    margin: 0 0 8px;
}

.asked-one {
    padding: 12px 14px;
    margin-bottom: 10px;
    border: 1px solid color-mix(in srgb, var(--blocking) 45%, var(--border-2));
    border-radius: 9px;
    background: var(--raised);
}

.asked-one.done {
    border-color: var(--border-2);
}

.asked-text {
    margin: 0;
    font-weight: 500;
}

.asked-context {
    margin: 4px 0 0;
    color: var(--text-3);
    font-size: 12.5px;
}
</style>
