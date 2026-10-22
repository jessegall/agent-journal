<script setup>
import TextDisplay from "../kit/TextDisplay.vue";

defineProps({part: {type: Object, required: true}});
</script>

<template>
    <section :class="['revision-part', part.kind]">
        <header class="head">
            <h3>{{ part.title }}</h3>
            <template v-if="part.kind !== 'same'">
                <span class="badge">{{ part.kind }}</span>
            </template>
        </header>
        <template v-if="part.kind === 'changed'">
            <div class="diff">
                <template v-for="(line, i) in part.lines" :key="i">
                    <TextDisplay :class="['line', line.kind]" :text="line.text || ' '" />
                </template>
            </div>
        </template>
        <template v-else>
            <TextDisplay :text="part.body" />
        </template>
    </section>
</template>

<style scoped>
.revision-part {
    margin-top: 14px;
    padding-left: 10px;
    border-left: 2px solid transparent;
}

.revision-part.added {
    border-left-color: var(--progress);
}

.revision-part.changed {
    border-left-color: var(--accent);
}

.revision-part.removed {
    border-left-color: var(--danger);
    opacity: 0.6;
}

.revision-part.removed h3 {
    text-decoration: line-through;
}

.head {
    display: flex;
    align-items: center;
    gap: 8px;
}

.head h3 {
    margin: 0 0 4px;
    color: var(--text);
    font-size: 13px;
    font-weight: 600;
}

.badge {
    color: var(--text-3);
    font-size: 10.5px;
    letter-spacing: 0.05em;
    text-transform: uppercase;
}

.diff {
    margin: 4px 0 0;
    font-size: 13px;
    line-height: 1.55;
}

.line {
    min-height: 1.55em;
    padding: 0 6px;
    border-radius: 3px;
    color: var(--text-2);
}

.line :deep(p),
.line :deep(ul),
.line :deep(ol) {
    margin: 0;
}

.line.added {
    background: color-mix(in srgb, var(--progress) 16%, transparent);
    color: var(--text);
}

.line.removed {
    background: color-mix(in srgb, var(--danger) 14%, transparent);
    color: var(--text-3);
    text-decoration: line-through;
}
</style>
