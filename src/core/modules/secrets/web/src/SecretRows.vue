<script setup>
import {computed, ref} from "vue";
import {ActionsMenu, Btn, CardPage, Icon, removed, useWindow} from "@journal/window-kit";
import SecretDialog from "./SecretDialog.vue";
import SecretNewDialog from "./SecretNewDialog.vue";
import {secretCard, secretFields, secretMenu} from "./secretItems.js";

// the Secrets page holds no field: each secret is one card with the same lines, what waits on the user has its one button in the foot, and all change happens in a centred dialog
const view = useWindow();
const {rows, failure, loaded, act} = view.props.secrets;
const openId = ref(0);
const isMaking = ref(false);
const items = computed(() => rows.value.map(secretCard));
const opened = computed(() => rows.value.find((row) => row.id === openId.value) ?? null);
const menuOf = (item) => secretMenu(item, {edit: () => (openId.value = item.id), remove: () => act(["secret", "delete", String(item.id)], removed(item.id))});
const place = (item) => ({head: item.title, items: menuOf(item)});
</script>

<template>
    <CardPage title="Secrets" :items="items" :fields="secretFields" :place="place" empty-title="No secrets yet" data-secrets>
        <template #primary>
            <Btn small variant="primary" data-secret-new @click="isMaking = true"><Icon name="plus" :size="12" />New secret</Btn>
        </template>
        <template #empty>
            <template v-if="failure">
              <p class="failure" role="alert">{{ failure }}</p>
            </template>
            <template v-else>
              <p class="lead">{{ loaded ? "Add a key or login to get started. Only its name will appear here." : "Loading" }}</p>
            </template>
        </template>
        <template #card="{item}">
            <p class="meta" data-secret-programs :title="item.programs">Programs: {{ item.programs }}</p>
            <p class="meta" data-secret-helpers-line>Helpers: {{ item.row.helpers ? "can use it" : "cannot use it" }}</p>
        </template>
        <template #foot="{item}">
            <template v-if="item.row.waiting">
              <Btn small variant="primary" :data-secret-ask="item.id" @click="openId = item.id">Add credentials</Btn>
            </template>
            <template v-else>
              <Btn small bordered data-secret-update @click="openId = item.id">Edit secret</Btn>
            </template>
        </template>
        <template #card-actions="{item}">
            <ActionsMenu :items="menuOf(item)" :head="item.title" />
        </template>
    </CardPage>
    <template v-if="opened">
        <SecretDialog :key="opened.id" :row="opened" :run="act" @close="openId = 0" />
    </template>
    <template v-if="isMaking">
        <SecretNewDialog :run="act" @close="isMaking = false" />
    </template>
</template>

<style scoped>
.lead {
    max-width: 640px;
    margin: 0;
    color: var(--text-3);
    font-size: 12.5px;
    line-height: 1.55;
}

.meta {
    margin: 0;
    overflow: hidden;
    color: var(--text-3);
    font-size: 12px;
    text-overflow: ellipsis;
    white-space: nowrap;
}

.failure {
    margin: 0;
    color: var(--danger);
    font-size: 12.5px;
}
</style>
