<script setup>
// a titled run of settings; the section list jumps to it by its key
defineProps({sectionKey: {type: String, required: true}, title: {type: String, required: true}, help: {type: String, default: ""}});
</script>

<template>
    <section class="setting-section" :data-section="sectionKey">
        <h4>{{ title }}</h4>
        <template v-if="help">
            <p class="help">{{ help }}</p>
        </template>
        <slot />
    </section>
</template>

<style scoped>
.setting-section { padding-top: 18px; }
.setting-section + .setting-section { margin-top: 6px; }
h4 { margin: 0; color: var(--text); font-size: 13px; font-weight: 600; }
.help { max-width: 680px; margin: 3px 0 8px; color: var(--text-3); font-size: 12px; line-height: 1.5; text-wrap: pretty; }
</style>
