<script setup>
import {computed, onMounted, ref} from "vue";
import PhoneAsk from "./PhoneAsk.vue";
import PhoneGroupRows from "./PhoneGroupRows.vue";
import PhonePage from "./PhonePage.vue";
import {groupNamed, loadCatalog, loaded, stopJournal} from "./catalog.js";

const props = defineProps({target: {type: String, required: true}, back: {type: String, default: ""}});
const emit = defineEmits(["back", "open"]);
const group = computed(() => groupNamed(props.target));
const asking = ref("");

const ACTS = {
    diagnostics: () => emit("open", "log:diagnostics"),
    stop: () => (asking.value = "stop"),
};

onMounted(() => loaded.value || loadCatalog());
</script>

<template>
    <PhonePage :title="group ? group.title : 'Setting'" :line="group ? group.line : ''" :back="back" @back="emit('back')">
        <template v-if="group">
            <PhoneGroupRows :group="group" @act="ACTS[$event]()" />
        </template>
    </PhonePage>
    <template v-if="asking === 'stop'">
        <PhoneAsk
            title="Shut down the journal?"
            sub="The phone cannot reach it until you start it on your computer. Nothing is deleted."
            button="Shut down"
            keep="Keep it running"
            danger
            @close="asking = ''"
            @done="stopJournal"
        />
    </template>
</template>
