<script setup>
import {ref, watch} from "vue";
import {useWindow} from "@journal/window-kit";
import Btn from "../kit/Btn.vue";
import {remember, remembered} from "../platform/storage.js";

// the band that says a newer release is out, with the way to install it; a check that cannot answer shows nothing, and a
// release put off with Not now is not offered again in this browser
const DISMISSED_RELEASE = "update-dismissed-release";
const props = defineProps({run: {type: Function, required: true}});
const view = useWindow();
const available = ref(false);
const installing = ref(false);
const failure = ref("");

watch(view.props.update.data, (status) => {
    available.value = status?.is_current === false && status.checksum !== remembered(DISMISSED_RELEASE, "");
}, {immediate: true});

function later() {
    remember(DISMISSED_RELEASE, view.props.update.data.value?.checksum ?? "");
    available.value = false;
}

async function install() {
    installing.value = true;
    const answer = await props.run(["update", "install"]);
    installing.value = false;
    failure.value = answer.ok ? "" : answer.error;
    if (answer.ok) available.value = false;
}
</script>

<template>
    <template v-if="available">
        <div class="band" role="status" data-update-band>
            <span class="text">{{ failure || "A newer version of the journal is out." }}</span>
            <Btn small variant="primary" :disabled="installing" data-update-install @click="install">{{ installing ? "Installing" : "Install it" }}</Btn>
            <Btn small data-update-later @click="later">Not now</Btn>
        </div>
    </template>
</template>

<style scoped>
.band {
    display: flex;
    flex: none;
    gap: 8px;
    align-items: center;
    padding: 5px 16px;
    border-bottom: 1px solid var(--border);
    background: var(--accent-dim);
    font-size: 13px;
}

.text {
    flex: 1;
    min-width: 0;
}
</style>
