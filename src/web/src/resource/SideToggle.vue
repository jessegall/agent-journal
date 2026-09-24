<script setup>
import {inject} from "vue";
import Btn from "../kit/Btn.vue";
import Icon from "../kit/Icon.vue";

const props = defineProps({
    mode: {type: String, required: true},
    icon: {type: String, required: true},
    label: {type: String, required: true},
    count: {type: Number, default: 0},
});
const talk = inject("talk", null);
</script>

<template>
    <template v-if="talk">
        <Btn small :class="['side-toggle', {on: talk.talking.value && talk.aside.value === mode}]" @click="talk.toggle(mode)">
            <Icon :name="icon" :size="12" />
            {{ label }}
            <template v-if="count">
                <span class="side-count">{{ count }}</span>
            </template>
        </Btn>
    </template>
</template>

<style scoped>
.side-count {
    color: var(--text-3);
}

.side-toggle.on {
    border-color: var(--accent);
    color: var(--accent-text);
}
</style>
