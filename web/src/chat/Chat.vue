<script setup>
import { computed, nextTick, ref, watch } from "vue";
import { create } from "../api.js";
import Btn from "../kit/Btn.vue";
import Icon from "../kit/Icon.vue";
import { route } from "../route.js";
import { open, reload, rows } from "../store.js";
import Message from "./Message.vue";

const text = ref("");
const kind = ref("message");
const error = ref("");
const scroller = ref(null);
const thread = computed(() => rows("message").filter((m) => !m.deleted));
const notices = computed(() => open("notice"));

async function send() {
  if (!text.value.trim()) return;
  error.value = "";
  try {
    const title = text.value.trim().split("\n")[0].replace(/:/g, " -").slice(0, 80);
    await create(route.value.env, "message", { title, brief: text.value.trim(), ...(kind.value === "transcript" ? { kind: "transcript" } : {}) });
    text.value = "";
    await reload();
  } catch (e) {
    error.value = e.message;
  }
}

watch(() => thread.value.length, async () => { await nextTick(); if (scroller.value) scroller.value.scrollTop = scroller.value.scrollHeight; }, { immediate: true });
</script>

<template>
  <div class="chat">
    <div v-for="n in notices" :key="n.n" :class="['notice', n.data.tone]">
      <span class="ntext">{{ n.title }}</span>
      <a v-if="n.data.link" :href="n.data.link" target="_blank" class="nlink">{{ n.data.label || "Open" }}</a>
    </div>
    <div ref="scroller" class="thread">
      <p v-if="!thread.length" class="empty">Write to the agent: what you leave here reaches it while it is idle.</p>
      <Message v-for="m in thread" :key="m.n" :message="m" />
    </div>
    <form class="composer" @submit.prevent="send">
      <textarea v-model="text" rows="3" :placeholder="kind === 'transcript' ? 'Paste the transcript…' : 'Write to the agent…'" @keydown.meta.enter="send" @keydown.ctrl.enter="send" />
      <div class="tools">
        <button type="button" :class="['flat', { on: kind === 'transcript' }]" @click="kind = kind === 'transcript' ? 'message' : 'transcript'"><Icon name="clip" :size="14" /> transcript</button>
        <span class="error">{{ error }}</span>
        <Btn kind="primary" small @click="send"><Icon name="send" :size="13" /> Send</Btn>
      </div>
    </form>
  </div>
</template>

<style scoped>
.chat { flex: 1; min-height: 0; display: flex; flex-direction: column; }
.notice { display: flex; align-items: center; gap: 12px; padding: 8px 22px; border-bottom: 1px solid var(--border); background: var(--raised); color: var(--text-2); }
.notice.warn { background: var(--warn-bg); color: var(--warn); }
.notice.good { color: var(--good); }
.nlink { margin-left: auto; color: var(--accent-text); }
.thread { flex: 1; min-height: 0; overflow: auto; padding: 16px 22px; }
.empty { color: var(--text-3); }
.composer { flex: none; margin: 0 22px 18px; border: 1px solid var(--border-2); border-radius: 10px; background: var(--raised); }
textarea { display: block; width: 100%; padding: 12px 14px; border: 0; background: none; resize: none; outline: none; }
.tools { display: flex; align-items: center; gap: 10px; padding: 6px 10px 8px 14px; }
.flat { display: inline-flex; align-items: center; gap: 5px; border: 0; background: none; color: var(--text-3); cursor: pointer; }
.flat.on { color: var(--accent-text); }
.error { flex: 1; color: var(--danger); font-size: 12px; }
</style>
