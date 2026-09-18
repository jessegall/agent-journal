<script setup>
import { computed } from "vue";
import Btn from "../kit/Btn.vue";
import Icon from "../kit/Icon.vue";
import { go, route } from "../route.js";
import { meta, store, unreadByUser } from "../store.js";

const title = computed(() => (!route.value.page ? "Home" : route.value.page === "settings" ? "Settings" : route.value.page === "search" ? "Search" : `${meta(route.value.page).title}s`));
const bell = computed(() => unreadByUser("notification").length);
</script>

<template>
  <header class="top">
    <span class="crumb"><span class="env">{{ route.env }}</span><span class="sep">/</span><span class="here">{{ title }}</span>
      <span v-if="route.page && meta(route.page)" class="help" :title="meta(route.page).help"><Icon name="info" :size="14" /></span>
    </span>
    <span class="tools">
      <Btn kind="icon" title="Search" @click="go(route.env, 'search')"><Icon name="search" /></Btn>
      <Btn kind="icon" title="Notifications" class="bellbtn" @click="go(route.env)"><Icon name="bell" /><b v-if="bell" class="count">{{ bell }}</b></Btn>
      <Btn kind="icon" :class="{ on: store.activity }" title="Activity" @click="store.activity = !store.activity"><Icon name="panel" /></Btn>
    </span>
  </header>
</template>

<style scoped>
.top { flex: none; display: flex; align-items: center; justify-content: space-between; height: 52px; padding: 0 14px 0 22px; border-bottom: 1px solid var(--border); }
.crumb { display: flex; align-items: center; gap: 8px; }
.env { color: var(--text-2); }
.sep { color: var(--text-3); }
.here { font-weight: 500; }
.help { color: var(--text-3); display: inline-flex; }
.tools { display: flex; gap: 2px; }
.bellbtn { position: relative; }
.count { position: absolute; top: -2px; right: -2px; min-width: 16px; padding: 0 4px; border-radius: 8px; background: var(--accent); color: #fff; font-size: 10px; text-align: center; line-height: 16px; }
.on { background: var(--sel); color: var(--text); }
</style>
