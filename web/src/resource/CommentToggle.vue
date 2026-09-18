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
            {{ talk.count.value ? `${talk.count.value} comment${talk.count.value === 1 ? "" : "s"}` : "Comment" }}
        </Btn>
    </template>
</template>

<style scoped>
.comment-toggle.on {
    border-color: var(--accent);
    color: var(--accent-text);
}
</style>
