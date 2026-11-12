<script setup>
// settings that only matter while another setting is on: indented under it, and not there while it is off
defineProps({shown: {type: Boolean, default: true}});
</script>

<template>
    <template v-if="shown">
        <div class="setting-nested" data-setting-nested>
            <slot />
        </div>
    </template>
</template>

<style scoped>
.setting-nested { margin-left: 6px; padding-left: 16px; border-left: 1px solid var(--border-3); }
</style>
