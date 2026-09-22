<script setup>
import {inject} from "vue";
import Btn from "../kit/Btn.vue";
import Icon from "../kit/Icon.vue";

const talk = inject("talk", null);
</script>

<template>
    <template v-if="talk">
        <Btn small :class="['comment-toggle', {on: talk.talking.value}]" @click="talk.toggle()">
            <Icon name="bubble" :size="12" />
            Comments
            <template v-if="talk.count.value">
                <span class="comment-count">{{ talk.count.value }}</span>
            </template>
        </Btn>
    </template>
</template>

<style scoped>
.comment-count {
    color: var(--text-3);
}

.comment-toggle.on {
    border-color: var(--accent);
    color: var(--accent-text);
}
</style>
