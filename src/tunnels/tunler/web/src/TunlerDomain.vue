<script setup>
import {ref} from "vue";
import {Btn} from "@journal/window-kit";

// one tunler address of this account: release it, or move this journal off it to a new name
const SUBDOMAIN_SETTING = "journal.tunnels.tunler.subdomain";

defineProps({domain: {type: Object, required: true}});
const emit = defineEmits(["run"]);
const asking = ref("");
const newName = ref("");
const setting = (key, value) => ["setting", "set", key, value, "--project"];

function run(...lines) {
    asking.value = "";
    emit("run", lines);
}

const moveAddress = (domain) => run(setting(SUBDOMAIN_SETTING, newName.value.trim()), ["tunler", "release", domain.name]);
</script>

<template>
<div class="domain" :data-tunler-domain="domain.name">
    <div class="row">
        <span class="name">{{ domain.name }}</span>
        <template v-if="domain.own">
            <span class="fine">In use</span>
        </template>
        <template v-if="asking !== domain.name">
            <Btn small data-tunler-release @click="asking = domain.name">{{ domain.own ? "Move to a new address" : "Release" }}</Btn>
        </template>
    </div>
    <template v-if="asking === domain.name && domain.own">
        <p class="fine">Share links stop working and a paired phone has to be paired again.</p>
        <form class="row" data-tunler-move @submit.prevent="moveAddress(domain)">
            <input v-model="newName" placeholder="The new name" aria-label="The new name">
            <Btn small variant="primary" type="submit" :disabled="!newName.trim()">Move to the new address</Btn>
            <Btn small @click="asking = ''">Keep it</Btn>
        </form>
    </template>
    <template v-else-if="asking === domain.name">
        <p class="fine">Release it? Anyone can claim it after.</p>
        <div class="row">
            <Btn small variant="primary" data-tunler-release-confirm @click="run(['tunler', 'release', domain.name])">Release the address</Btn>
            <Btn small @click="asking = ''">Keep it</Btn>
        </div>
    </template>
</div>
</template>

<style scoped>
.domain {
    display: flex;
    flex-direction: column;
    gap: 4px;
}

.name {
    overflow-wrap: anywhere;
}

.fine {
    margin: 0;
    color: var(--text-3);
    font-size: 12px;
}

.row {
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    gap: 8px;
}
</style>
