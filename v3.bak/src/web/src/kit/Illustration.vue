<script setup>
import {ref, watch} from "vue";

const props = defineProps({src: {type: String, default: ""}, size: {type: Number, default: 48}, fill: Boolean});
const missing = ref(false);

watch(
    () => props.src,
    () => (missing.value = false)
);
</script>

<template>
    <template v-if="src && !missing">
        <img
            :class="['illustration', {fill}]"
            :src="src"
            :width="fill ? undefined : size"
            :height="size"
            alt=""
            loading="lazy"
            @error="missing = true"
        />
    </template>
</template>

<style scoped>
.illustration.fill {
    width: 100%;
}

.illustration {
    flex: none;
    border-radius: 12px;
    object-fit: contain;
}
</style>
