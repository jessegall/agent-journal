<script setup>
import {computed} from "vue";
import OptionsPicker from "./OptionsPicker.vue";
import {linkedTo, meta} from "../store.js";

const props = defineProps({resource: Object});
const questions = computed(() => linkedTo(props.resource.ref).filter((r) => meta(r.type).fields.options && meta(r.type).attention));
</script>

<template>
    <template v-if="questions.length">
        <section class="asked">
            <h3>Questions in this {{ meta(resource.type).title.toLowerCase() }}</h3>
            <template v-for="q in questions" :key="q.ref">
                <div :class="['asked-one', {done: q.completed}]">
                    <p class="asked-text">{{ q.title }}</p>
                    <template v-if="q.abstract">
                        <p class="asked-context">{{ q.abstract }}</p>
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
    font-size: 12px;
    font-weight: 600;
    color: var(--text-3);
    text-transform: uppercase;
    letter-spacing: 0.04em;
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
