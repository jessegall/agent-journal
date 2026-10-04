<script setup>
import PhoneTicks from "./PhoneTicks.vue";
import {clock} from "../format/time.js";

defineProps({sent: {type: Array, required: true}, held: {type: Array, required: true}, offline: {type: Boolean, default: false}});
const emit = defineEmits(["discard"]);
const SENDING = {completed: 0, seen: [], data: {}};
</script>

<template>
    <template v-for="line in sent" :key="line.idempotency">
        <p class="home-sent">
            {{ line.brief }}
            <span>
                {{ clock(line.at / 1000) }}
                <PhoneTicks :message="SENDING" />
            </span>
        </p>
    </template>
    <template v-for="line in held" :key="line.idempotency">
        <template v-if="line.lost">
            <p class="home-held">
                {{ line.brief }}
                <span>{{ line.reason || "This was not sent. Write it again in a new message." }}</span>
                <button type="button" class="home-drop" @click="emit('discard', line.idempotency)">Remove</button>
            </p>
        </template>
        <template v-else>
            <p class="home-held">
                {{ line.brief }}
                <span>{{ offline ? "Waiting to send" : "Sending…" }}</span>
            </p>
        </template>
    </template>
</template>

<style scoped>
.home-sent {
    align-self: flex-end;
    max-width: 78%;
    margin: 0;
    padding: 8px 12px;
    border-radius: 18px;
    background: var(--accent);
    color: #fff;
    line-height: 1.35;
    white-space: pre-wrap;
}

.home-sent span {
    display: flex;
    align-items: center;
    justify-content: flex-end;
    gap: 4px;
    margin-top: 4px;
    color: #fff;
    font-size: 0.676rem;
    text-align: right;
}

.home-held {
    align-self: flex-end;
    max-width: 78%;
    margin: 0;
    padding: 8px 12px;
    border: 1px dashed var(--border-3);
    border-radius: 18px;
    line-height: 1.35;
}

.home-drop {
    min-height: 32px;
    margin-top: 6px;
    padding: 0 12px;
    border: 0;
    border-radius: 16px;
    background: var(--hover);
    color: var(--text);
    font: inherit;
    font-size: 0.882rem;
}

.home-held span {
    display: block;
    color: var(--text-3);
    font-size: 0.735rem;
}
</style>
