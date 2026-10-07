<script setup>
import PhoneSheet from "./PhoneSheet.vue";
import Cell from "./kit/Cell.vue";
import {asking} from "./unlock.js";

let picked = false;

function unlock(close) {
    picked = true;
    asking.value.run();
    close();
}

function closed() {
    if (!picked) asking.value.cancel();
    picked = false;
    asking.value = null;
}
</script>

<template>
    <PhoneSheet v-slot="{close}" label="Unlock to run a command" @close="closed">
        <h2 class="unlock-title">Unlock to run a command</h2>
        <p class="unlock-sub">A command runs on your computer only right after this phone unlocks again.</p>
        <div class="unlock-group">
            <Cell :label="asking.label" icon="lock" :chevron="false" @pick="unlock(close)" />
        </div>
    </PhoneSheet>
</template>

<style scoped>
.unlock-title {
    margin: 0;
    font-size: 1.0625rem;
}

.unlock-sub {
    margin: 2px 0 8px;
    color: var(--text-3);
    font-size: 0.8125rem;
}

.unlock-group {
    overflow: hidden;
    margin: 4px 0 8px;
    border-radius: 12px;
    background: var(--bg);
}
</style>
