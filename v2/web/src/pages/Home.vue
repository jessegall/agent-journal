<script setup>
import { computed, ref } from "vue";
import Icon from "../kit/Icon.vue";
import SwitchCase from "../kit/SwitchCase.vue";
import { go, route } from "../route.js";
import { meta, open, rows, store, types, unseenByUser } from "../store.js";
import Chat from "../chat/Chat.vue";
import ResourceRow from "../resource/ResourceRow.vue";
import PlanBar from "../chat/PlanBar.vue";

const tab = ref("waiting");
const quiet = ["message", "comment", "reaction", "notification", "nudge", "work", "environment", "todo"];
const waiting = computed(() => types.value.filter((t) => t.notify.includes("user") && !quiet.includes(t.name)).flatMap((t) => unseenByUser(t.name)));
const todos = computed(() => open("todo"));
const notifications = computed(() => [...rows("notification")].reverse());
const tabs = computed(() => [["waiting", "Waiting on you", waiting.value.length], ["todos", "To-dos", todos.value.length], ["notifications", "Notifications", unseenByUser("notification").length]]);
</script>

<template>
  <div class="home">
    <div class="left">
      <PlanBar />
      <Chat />
    </div>
    <aside class="right">
      <nav class="tabs">
        <button v-for="[key, name, count] in tabs" :key="key" type="button" :class="['tab', { on: tab === key }]" @click="tab = key">{{ name }}<b v-if="count">{{ count }}</b></button>
      </nav>
      <SwitchCase :value="tab">
        <template #todos>
          <ResourceRow v-for="r in todos" :key="r.n" :resource="r" @click="go(route.env, 'todo', r.n)" />
          <p v-if="!todos.length" class="empty">Nothing waiting.</p>
        </template>
        <template #notifications>
          <button v-for="n in notifications" :key="n.n" type="button" :class="['note', { unseen: !n.seen.includes('user') }]" @click="go(route.env, ...n.refs[0].split(':'))">
            <span class="ntitle">{{ n.title }}</span><span class="nabs">{{ n.abstract }}</span>
          </button>
          <p v-if="!notifications.length" class="empty">Nothing yet.</p>
        </template>
        <template #default>
          <button v-for="r in waiting" :key="r.ref" type="button" class="waiting" @click="go(route.env, r.type, r.n)">
            <span class="wkind">{{ meta(r.type).title }}</span>
            <span class="wtitle">{{ r.title }}</span>
            <span class="wabs">{{ r.abstract || r.brief.slice(0, 300) }}</span>
            <span class="wfoot">{{ r.type }} {{ r.n }}</span>
          </button>
          <p v-if="!waiting.length" class="empty">Nothing waits on you.</p>
        </template>
      </SwitchCase>
    </aside>
  </div>
</template>

<style scoped>
.home { display: flex; height: 100%; }
.left { flex: 1; min-width: 0; display: flex; flex-direction: column; }
.right { flex: none; width: 300px; overflow: auto; border-left: 1px solid var(--border); }
.tabs { display: flex; gap: 14px; padding: 0 14px; border-bottom: 1px solid var(--border); }
.tab { padding: 12px 0; border: 0; border-bottom: 2px solid transparent; background: none; color: var(--text-3); cursor: pointer; }
.tab.on { color: var(--text); border-bottom-color: var(--accent); }
.tab b { margin-left: 6px; color: var(--accent-text); font-weight: 500; }
.empty { margin: 16px; color: var(--text-3); }
.waiting { display: flex; flex-direction: column; gap: 4px; width: 100%; padding: 12px 14px; border: 0; border-bottom: 1px solid var(--border); background: none; text-align: left; cursor: pointer; }
.waiting:hover, .note:hover { background: var(--hover); }
.wkind { color: var(--warn); font-size: 11px; text-transform: uppercase; letter-spacing: .06em; }
.wtitle { font-weight: 500; }
.wabs { color: var(--text-2); white-space: pre-wrap; }
.wfoot { color: var(--text-3); font-size: 11.5px; }
.note { display: flex; flex-direction: column; width: 100%; padding: 10px 14px; border: 0; border-bottom: 1px solid var(--border); background: none; text-align: left; cursor: pointer; color: var(--text-3); }
.note.unseen { color: var(--text); }
.nabs { color: var(--text-3); font-size: 12.5px; }
</style>
