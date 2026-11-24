<script setup lang="ts">
import TextLink from '@/components/kit/TextLink.vue';
import type { LayoutRowData } from '@/generated/types/core';

// The facts of a declared layout as term and value pairs; a fact's value draws each piece as its own link when it has
// an address.
defineProps<{ rows: LayoutRowData[] }>();
</script>

<template>
    <dl class="grid grid-cols-[auto_1fr] gap-x-4 gap-y-1">
        <template v-for="row in rows" :key="row.key">
            <dt class="text-text-3">{{ row.label }}</dt>
            <dd class="text-text">
                <template v-if="row.fact !== undefined">
                    <template v-for="(piece, index) in row.fact.pieces" :key="index">
                        <template v-if="index > 0">, </template>
                        <template v-if="piece.href !== undefined">
                            <TextLink :href="piece.href">{{ piece.label }}</TextLink>
                        </template>
                        <template v-else>{{ piece.label }}</template>
                    </template>
                </template>
                <template v-else>{{ row.value }}</template>
            </dd>
        </template>
    </dl>
</template>
