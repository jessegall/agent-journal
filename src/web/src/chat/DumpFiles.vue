<script setup>
import FileSlip from "../kit/FileSlip.vue";

defineProps({files: {type: Array, required: true}});
const emit = defineEmits(["remove"]);
</script>

<template>
    <div class="dump-files">
        <template v-for="(file, i) in files" :key="file.name + i">
            <FileSlip class="dump-file" :file="file" removable @remove="emit('remove', i)" />
        </template>
    </div>
</template>

<style scoped>
.dump-files {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(210px, 1fr));
    gap: 8px;
}

.dump-file {
    animation: dump-file-settle 0.7s var(--ease) both;
}

.dump-file:nth-child(5n + 1) {
    rotate: -0.8deg;
}

.dump-file:nth-child(5n + 2) {
    rotate: 0.6deg;
}

.dump-file:nth-child(5n + 3) {
    rotate: 0.4deg;
}

.dump-file:nth-child(5n + 4) {
    rotate: -0.5deg;
}

.dump-file:nth-child(5n) {
    rotate: 0.7deg;
}

@keyframes dump-file-settle {
    from {
        opacity: 0;
        translate: 0 -12px;
    }
}

@media (prefers-reduced-motion: reduce) {
    .dump-file {
        animation: none;
    }
}
</style>
