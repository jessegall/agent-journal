<script setup>
import {computed} from "vue";
import CloseButton from "./CloseButton.vue";
import FileName from "./FileName.vue";
import PageThumb from "./PageThumb.vue";

const props = defineProps({
    file: {type: Object, required: true},
    removable: Boolean,
    meta: String,
    read: {type: Number, default: -1},
    kind: {type: String, default: ""},
    state: {type: String, default: ""},
    lit: Boolean,
});
const emit = defineEmits(["remove"]);
const KB = 1024;
const size = computed(() =>
    props.file.size < KB * KB ? `${Math.max(1, Math.round(props.file.size / KB))} KB` : `${(props.file.size / KB / KB).toFixed(1)} MB`
);
const extension = computed(() => props.kind || props.file.name.split(".").pop());
</script>

<template>
    <div :class="['file-slip', state, {reading: read >= 0 && read < 1, lit}]">
        <PageThumb :lines="3" :label="extension" :read="read" />
        <span class="file-slip-words">
            <FileName :name="file.name" class="file-slip-name" />
            <span class="file-slip-meta">{{ meta || size }}</span>
        </span>
        <template v-if="removable">
            <CloseButton title="Take the document away" @click.stop="emit('remove')" />
        </template>
    </div>
</template>

<style scoped>
.file-slip {
    display: flex;
    align-items: center;
    gap: 12px;
    min-width: 0;
    padding: 8px 10px;
    border: 1px solid var(--border-2);
    border-radius: 9px;
    background: var(--bg);
}

.file-slip-words {
    display: flex;
    flex: 1;
    flex-direction: column;
    gap: 2px;
    min-width: 0;
}

.file-slip-name {
    color: var(--text);
}

.file-slip-meta {
    color: var(--text-3);
    font-size: 12.5px;
    transition: color var(--fade);
}

.file-slip.reading .file-slip-meta,
.file-slip.lit .file-slip-meta {
    color: var(--accent-text);
}

.file-slip.waiting {
    opacity: 0.5;
}

.file-slip.filed .file-slip-meta {
    color: var(--tone-good);
}

.file-slip.read .file-slip-meta {
    color: var(--accent-text);
}

.file-slip.read .file-slip-meta::before {
    content: "✓ read · ";
}

.file-slip.failed .file-slip-meta {
    color: var(--danger);
}

.file-slip.lit {
    border-color: var(--accent);
    background: color-mix(in srgb, var(--accent) 10%, var(--bg));
}
</style>
