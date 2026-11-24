<script setup lang="ts">
import type { CSSProperties } from 'vue';
import type { ScreenRunData, ScreenStyleData } from '@generated/types/core';

/**
 * One row of an agent's terminal as runs of one style; cell text is shown only as text, never as markup.
 */
defineProps<{ runs: ScreenRunData[]; plain: boolean }>();

function styleOf(
    style: ScreenStyleData,
    plain: boolean,
): CSSProperties {
    if (plain) {
        return {};
    }
    const foreground = style.fg ?? 'var(--terminal-fg)';
    const background = style.bg ?? 'var(--terminal-bg)';

    return {
        color: style.isInverse ? background : foreground,
        backgroundColor: style.isInverse ? foreground : background,
        fontWeight: style.isBold ? 'bold' : 'normal',
        fontStyle: style.isItalic ? 'italic' : 'normal',
        textDecoration: style.isUnderlined ? 'underline' : 'none',
    };
}
</script>

<template>
    <div class="h-[1lh] whitespace-pre">
        <template v-for="(run, index) in runs" :key="index"
            ><span :style="styleOf(run.style, plain)">{{
                run.text
            }}</span></template
        >
    </div>
</template>
