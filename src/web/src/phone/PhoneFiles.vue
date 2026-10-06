<script setup>
import {isPicture} from "../format/files.js";
import {phone} from "../api/phone.js";
import Icon from "../kit/Icon.vue";

const props = defineProps({
    type: {type: String, required: true},
    n: {type: Number, required: true},
    files: {type: Array, default: () => []},
});
const fileUrl = (name) => phone.fileUrl(props.type, props.n, name);
</script>

<template>
    <span class="turn-files">
        <template v-for="name in files" :key="name">
            <a class="turn-file" :href="fileUrl(name)" :data-peek="`attachment:${type}/${n}/${encodeURIComponent(name)}`">
                <template v-if="isPicture(name)">
                    <img class="turn-picture" :src="fileUrl(name)" :alt="name" loading="lazy" />
                </template>
                <template v-else>
                    <Icon name="paperclip" :size="12" />
                    {{ name }}
                </template>
            </a>
        </template>
    </span>
</template>

<style scoped>
.turn-files {
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    gap: 6px;
    margin-top: 6px;
    color: var(--text-2);
    font-size: 0.765rem;
}

.turn-file {
    display: inline-flex;
    align-items: center;
    gap: 4px;
    color: var(--accent-text);
}

.turn-picture {
    display: block;
    max-width: 200px;
    max-height: 200px;
    border-radius: 8px;
    object-fit: cover;
}
</style>
