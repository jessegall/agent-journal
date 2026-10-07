<script setup>
import MenuPanel from "../kit/MenuPanel.vue";
import WaitingList from "./WaitingList.vue";

defineProps({waiting: {type: Object, required: true}, anchor: {type: Object, default: null}});
const emit = defineEmits(["close"]);
</script>

<template>
    <MenuPanel :anchor="anchor" plain :min-width="300" :max-width="380" :gap="12" @click.stop @close="emit('close')">
        <WaitingList :waiting="waiting" @close="emit('close')" />
    </MenuPanel>
</template>
