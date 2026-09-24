<script setup>
import Btn from "../kit/Btn.vue";
import Dialog from "../kit/Dialog.vue";
import {computed} from "vue";
import {useEnvironmentTab} from "../composables/environmentTab.js";
import {go, route} from "../route.js";
import {rows} from "../sync/rows.js";

const {taken, claim} = useEnvironmentTab();
const others = computed(() =>
    rows("environment")
        .filter((e) => !e.completed && !e.data.owner && e.title !== route.value.env)
        .map((e) => e.title)
);
</script>

<template>
    <template v-if="taken">
        <Dialog title="Open in another tab" small :closable="false">
            <p class="taken">
                {{ route.env }} is open in a newer tab, and one tab works an environment at a time. Use it here, or open another environment
                in this tab.
            </p>
            <div class="others">
                <template v-for="name in others" :key="name">
                    <Btn small @click="go(name)">{{ name }}</Btn>
                </template>
            </div>
            <template #foot>
                <Btn kind="primary" @click="claim">Use it here</Btn>
            </template>
        </Dialog>
    </template>
</template>

<style scoped>
.others {
    display: flex;
    flex-wrap: wrap;
    gap: 6px;
    margin-top: 14px;
}

.taken {
    margin: 0;
    color: var(--text-2);
    font-size: 14px;
    line-height: 22px;
}
</style>
