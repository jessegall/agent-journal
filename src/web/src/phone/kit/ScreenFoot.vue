<script setup>
defineProps({shown: Boolean});
</script>

<template>
    <template v-if="shown">
        <footer class="screen-foot">
            <slot />
        </footer>
    </template>
</template>
