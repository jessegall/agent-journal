<script setup>
import {computed, nextTick, ref, watch} from "vue";
import {act, create} from "../api.js";
import {route} from "../route.js";
import {reload, rows} from "../store.js";
import Compose from "./Compose.vue";
import Turn from "./Turn.vue";

const scroller = ref(null);
const turns = computed(() =>
    [
        ...rows("message")
            .filter((m) => !m.deleted)
            .map((m) => ({...m, who: m.seen[0]})),
        ...rows("comment")
            .filter((c) => !c.deleted && c.refs.some((r) => r.startsWith("message:")))
            .map((c) => ({...c, who: c.seen[0]})),
    ].sort((a, b) => a.created - b.created)
);

async function post(text, files) {
    const title = text.split("\n")[0].replace(/:/g, " -").slice(0, 80);
    const message = await create(route.value.env, "message", {title, brief: text});
    for (const f of files) await upload(message.n, f);
    await reload();
}

async function upload(n, file) {
    const body = new FormData();
    body.append("file", file, file.name);
    const res = await fetch(`/api/${route.value.env}/message/${n}/upload`, {method: "POST", body});
    if (!res.ok) throw new Error((await res.json()).error || res.statusText);
}

watch(
    () => turns.value.length,
    async () => {
        await nextTick();
        if (scroller.value) scroller.value.scrollTop = scroller.value.scrollHeight;
    },
    {immediate: true}
);
</script>

<template>
    <div class="thread">
        <div class="thread-write">
            <Compose :send="post" />
        </div>
        <div ref="scroller" class="thread-scroll">
            <template v-if="!turns.length">
                <p class="thread-empty">Nothing has been said here yet.</p>
            </template>
            <template v-for="t in turns" :key="t.ref">
                <Turn :turn="t" />
            </template>
        </div>
    </div>
</template>

<style scoped>
.thread {
    position: relative;
    flex: 1;
    min-height: 0;
    display: flex;
    flex-direction: column;
}

.thread-scroll {
    order: 1;
    flex: 1;
    min-height: 0;
    overflow-y: auto;
    overflow-x: hidden;
    display: flex;
    flex-direction: column;
    gap: 7px;
    padding: 14px 8px 12px;
}

.thread-write {
    order: 2;
    position: relative;
    flex: none;
    display: flex;
    flex-direction: column;
    gap: 6px;
    margin: 0 calc(-1 * var(--home-gutter));
    padding: 8px var(--home-gutter) 12px;
}

.thread-write :deep(.compose-box) {
    margin-right: 2px;
}

.thread-empty {
    padding: 18px 2px;
    color: var(--text-3);
}
</style>
