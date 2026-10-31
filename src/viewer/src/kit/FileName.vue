<script setup>
import {computed} from "vue";

const props = defineProps({name: {type: String, required: true}, keep: {type: Number, default: 12}});
const split = computed(() => {
    const dot = props.name.lastIndexOf(".");
    const tail = Math.max(props.keep, dot > 0 ? props.name.length - dot + 4 : 0);
    if (props.name.length <= tail + 4) return {head: props.name, tail: ""};
    return {head: props.name.slice(0, -tail), tail: props.name.slice(-tail)};
});
</script>

<template>
    <span class="file-name" :title="name">
        <span class="file-name-head">{{ split.head }}</span>
        <template v-if="split.tail">
            <span class="file-name-tail">{{ split.tail }}</span>
        </template>
    </span>
</template>

<style scoped>
.file-name {
    display: inline-flex;
    min-width: 0;
    max-width: 100%;
    white-space: pre;
}

.file-name-head {
    min-width: 0;
    overflow: hidden;
    text-overflow: ellipsis;
}

.file-name-tail {
    flex: none;
}
</style>
