<script setup>
import {ref} from "vue";
import Btn from "../kit/Btn.vue";
import Icon from "../kit/Icon.vue";
import {api} from "../api/client.js";

const props = defineProps({resource: Object});
const picker = ref(null);
const busy = ref(false);
const error = ref("");

async function attach(list) {
    error.value = "";
    busy.value = true;
    try {
        for (const file of list) await api.upload(props.resource.type, props.resource.n, file);
    } catch (e) {
        error.value = e.message;
    } finally {
        busy.value = false;
        picker.value.value = "";
    }
}
</script>

<template>
    <span class="attach">
        <template v-if="error">
            <span class="attach-error">{{ error }}</span>
        </template>
        <Btn small :busy="busy" title="Add files to this document" @click="picker.click()">
            <Icon name="paperclip" :size="12" />
            {{ busy ? "Attaching…" : "Attach files" }}
        </Btn>
        <input ref="picker" type="file" multiple hidden @change="attach([...$event.target.files])" />
    </span>
</template>

<style scoped>
.attach {
    display: inline-flex;
    align-items: center;
    gap: 8px;
}

.attach-error {
    color: var(--danger);
    font-size: 12px;
}
</style>
