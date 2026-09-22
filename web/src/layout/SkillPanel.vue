<script setup>
import {onUnmounted, ref, watch} from "vue";
import {api} from "../api/client.js";
import {store} from "../state/store.js";
import Icon from "../kit/Icon.vue";
import Markdown from "../resource/Markdown.vue";

const text = ref("");
const failed = ref("");

watch(
    () => store.skill,
    async (name) => {
        text.value = "";
        failed.value = "";
        if (!name) return;
        try {
            const got = await api.skill(name);
            text.value = got.text.replace(/^---\n[\s\S]*?\n---\n/, "");
        } catch (e) {
            failed.value = e.message;
        }
    },
    {immediate: true}
);

const onEscape = (e) => {
    if (e.key === "Escape") store.skill = "";
};
window.addEventListener("keydown", onEscape);
onUnmounted(() => window.removeEventListener("keydown", onEscape));
</script>

<template>
    <aside class="skill-panel">
        <header class="skill-panel-head">
            <Icon name="book" :size="14" />
            <span class="skill-panel-title">{{ store.skill }}</span>
            <span class="grow" />
            <button type="button" class="skill-panel-close" title="Close" @click="store.skill = ''">
                <Icon name="close" :size="14" />
            </button>
        </header>
        <div class="skill-panel-body">
            <template v-if="failed">
                <p class="skill-panel-note">{{ failed }}</p>
            </template>
            <template v-else-if="!text">
                <p class="skill-panel-note">Loading the skill…</p>
            </template>
            <template v-else>
                <Markdown :text="text" />
            </template>
        </div>
    </aside>
</template>

<style scoped>
.skill-panel {
    position: fixed;
    top: 0;
    right: 0;
    bottom: 0;
    z-index: 40;
    display: flex;
    flex-direction: column;
    width: min(520px, 100vw);
    border-left: 1px solid var(--border);
    background: var(--raised);
    box-shadow: -12px 0 32px rgb(0 0 0 / 30%);
}

.skill-panel-head {
    display: flex;
    align-items: center;
    gap: 8px;
    padding: 12px 16px;
    border-bottom: 1px solid var(--border);
    color: var(--text-2);
    font-size: 13px;
}

.skill-panel-title {
    color: var(--text);
    font-weight: 500;
}

.grow {
    flex: 1;
}

.skill-panel-close {
    display: flex;
    padding: 4px;
    border: none;
    border-radius: 6px;
    background: none;
    color: var(--text-2);
    cursor: pointer;
}

.skill-panel-close:hover {
    background: var(--hover);
    color: var(--text);
}

.skill-panel-body {
    flex: 1;
    padding: 16px 20px;
    overflow-y: auto;
    font-size: 13.5px;
}

.skill-panel-note {
    color: var(--text-3);
}
</style>
