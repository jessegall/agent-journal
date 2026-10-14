<script setup>
import {ref} from "vue";
import {releaseDomain} from "../composables/tunnel.js";
import Btn from "../kit/Btn.vue";

const props = defineProps({domain: {type: String, required: true}, own: {type: Boolean, default: false}});
const emit = defineEmits(["released"]);
const asking = ref(false);
const busy = ref(false);
const failure = ref("");

async function release() {
    busy.value = true;
    failure.value = "";
    try {
        emit("released", await releaseDomain(props.domain, props.own));
    } catch (e) {
        failure.value = e.message;
    } finally {
        busy.value = false;
        asking.value = false;
    }
}
</script>

<template>
    <div class="domain">
        <span class="domain-name">{{ domain }}</span>
        <template v-if="own">
            <span class="domain-own">In use</span>
        </template>
        <template v-if="asking && own">
            <span class="domain-ask">
                Move this journal to a new address? Share links stop working and a paired phone has to be paired again.
            </span>
            <Btn small kind="primary" :busy="busy" @click="release">Move</Btn>
            <Btn small @click="asking = false">Keep</Btn>
        </template>
        <template v-else-if="asking">
            <span class="domain-ask">Release it? Anyone can claim it after.</span>
            <Btn small kind="primary" :busy="busy" @click="release">Release</Btn>
            <Btn small @click="asking = false">Keep</Btn>
        </template>
        <template v-else>
            <Btn small @click="asking = true">{{ own ? "Move to a new address" : "Release" }}</Btn>
        </template>
        <template v-if="failure">
            <span class="domain-failure">{{ failure }}</span>
        </template>
    </div>
</template>

<style scoped>
.domain {
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    gap: 8px;
    padding: 8px 16px;
    border-top: 1px solid var(--line);
}

.domain-name {
    flex: 1;
    min-width: 0;
    overflow: hidden;
    color: var(--text);
    font-family: var(--mono);
    font-size: 12.5px;
    text-overflow: ellipsis;
    white-space: nowrap;
}

.domain-own {
    color: var(--text-3);
    font-size: 12px;
}

.domain-ask {
    color: var(--text-2);
    font-size: 12.5px;
}

.domain-failure {
    flex-basis: 100%;
    color: var(--danger);
    font-size: 12.5px;
}
</style>
