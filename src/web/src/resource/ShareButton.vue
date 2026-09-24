<script setup>
import {computed, ref} from "vue";
import Btn from "../kit/Btn.vue";
import Icon from "../kit/Icon.vue";
import {sharesOf} from "../composables/shares.js";
import ShareDialog from "./ShareDialog.vue";

const props = defineProps({resource: {type: Object, required: true}});
const shown = ref(false);
const open = computed(() => sharesOf(`${props.resource.type}:${props.resource.n}`).value);
</script>

<template>
    <Btn
        small
        :class="['share-toggle', {live: open.length}]"
        :title="open.length ? `${open.length} open link` : 'Share a link to this'"
        @click="shown = true"
    >
        <Icon name="share" :size="12" />
        Share
        <template v-if="open.length">
            <span class="share-count">{{ open.length }}</span>
        </template>
    </Btn>
    <template v-if="shown">
        <ShareDialog :resource="resource" @close="shown = false" />
    </template>
</template>

<style scoped>
.share-count {
    color: var(--tone-good);
}

.share-toggle.live {
    border-color: color-mix(in srgb, var(--tone-good) 45%, transparent);
}
</style>
