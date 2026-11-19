<script setup lang="ts">
import type { ScreenRunData, ScreenStyleData } from '@generated/types/core';

/**
 * One row of an agent's terminal as runs of one style; cell text is shown only as text, never as markup.
 */
defineProps<{ runs: ScreenRunData[]; plain: boolean }>();

function styleOf(style: ScreenStyleData, plain: boolean): Record<string, string> {
    if (plain) {
        return {};
    }
    const foreground = style.fg === '' ? 'var(--terminal-fg)' : style.fg;
    const background = style.bg === '' ? 'var(--terminal-bg)' : style.bg;

    return {
        color: style.inverse ? background : foreground,
        backgroundColor: style.inverse ? foreground : background,
        fontWeight: style.bold ? 'bold' : 'normal',
        fontStyle: style.italic ? 'italic' : 'normal',
        textDecoration: style.underline ? 'underline' : 'none',
    };
}
</script>

<template>
    <div class="h-[1lh] whitespace-pre"><span
        v-for="(run, index) in runs"
        :key="index"
        :style="styleOf(run.style, plain)"
    >{{ run.text }}</span></div>
</template>
