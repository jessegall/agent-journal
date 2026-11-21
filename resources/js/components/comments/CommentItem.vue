<script setup lang="ts">
import type {
    RecordCommentView,
    TextCommentView,
} from '@/generated/types/core';
import SwitchItem from '@/components/kit/SwitchItem.vue';

/**
 * One comment in a list: who left it and when, what it is about, and its text. A whole-record comment offers to open
 * its record; a text comment names its version and lines, says when that version is older, and opens its place.
 */
const props = defineProps<{
    item: RecordCommentView | TextCommentView;
    currentVersion?: string;
}>();

defineEmits<{ open: [commentId: string] }>();

const comment = props.item.comment;
</script>

<template>
    <article class="flex flex-col gap-1">
        <p class="text-small text-text-3">
            {{ comment.authorType }} {{ comment.authorId }} ·
            {{ comment.createdAt }}
        </p>
        <SwitchItem :item="item" by="type">
            <template #record>
                <button
                    type="button"
                    class="text-left text-small underline"
                    @click="$emit('open', comment.id)"
                >
                    On the whole record: open record
                </button>
            </template>
            <template #text="{ item: text }">
                <button
                    type="button"
                    class="text-left text-small underline"
                    @click="$emit('open', comment.id)"
                >
                    On {{ text.anchor.versionLabel }}, lines
                    {{ text.anchor.firstLine }}–{{ text.anchor.lastLine }}
                    <template
                        v-if="
                            currentVersion !== undefined &&
                            text.anchor.versionId !== currentVersion
                        "
                    >
                        (on an older version): open where it was</template
                    >
                </button>
            </template>
        </SwitchItem>
        <div class="prose" v-html="comment.bodyHtml" />
    </article>
</template>
