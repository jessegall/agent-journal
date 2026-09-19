<script setup>
import {computed, onUnmounted, ref} from "vue";
import Icon from "../kit/Icon.vue";
import RailNotes from "../pages/RailNotes.vue";
import {route} from "../route.js";
import {meta, store, unreadByUser} from "../store.js";

const PAGES = {settings: "Settings", search: "Search", files: "Files", commit: "Commit", skills: "Skills", hub: "Hub"};
const title = computed(() => (!route.value.page ? "Home" : PAGES[route.value.page] || `${meta(route.value.page).title}s`));
const waiting = computed(() => unreadByUser("notification").length);
const drop = ref(false);
const wrap = ref(null);
const away = (e) => {
    if (wrap.value && !wrap.value.contains(e.target)) drop.value = false;
};
window.addEventListener("click", away);
onUnmounted(() => window.removeEventListener("click", away));
</script>

<template>
    <div class="top">
        <div class="crumb">
            <a class="crumb-link" :href="`#/${route.env}`">{{ route.env }}</a>
            <span class="sep">/</span>
            <b>{{ title }}</b>
            <template v-if="route.page && meta(route.page)">
                <span class="icon-btn help-btn" :title="meta(route.page).help"><Icon name="info" /></span>
            </template>
        </div>
        <div class="top-tools">
            <a class="icon-btn" :href="`#/${route.env}/search`" title="Search"><Icon name="search" /></a>
            <div ref="wrap" class="drop-wrap">
                <button type="button" :class="['icon-btn', {on: drop}]" title="Notifications" :aria-expanded="drop" @click="drop = !drop">
                    <Icon name="bell" />
                    <template v-if="waiting">
                        <span class="tool-badge">{{ waiting }}</span>
                    </template>
                </button>
                <Transition name="drop">
                    <div v-if="drop" class="drop" @click="(e) => e.target.closest('.note-row') && (drop = false)">
                        <div class="drop-head">Notifications</div>
                        <RailNotes />
                    </div>
                </Transition>
            </div>
            <button
                type="button"
                :class="['icon-btn', {on: store.activity}]"
                :title="store.activity ? 'Hide Activity' : 'Show Activity'"
                @click="store.activity = !store.activity"
            >
                <Icon name="activity" />
            </button>
        </div>
    </div>
</template>

<style scoped>
.top {
    height: 48px;
    flex: none;
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 0 16px 0 20px;
    border-bottom: 1px solid var(--border);
}
.top-tools {
    display: flex;
    align-items: center;
    gap: 6px;
    flex: none;
}
.crumb {
    display: flex;
    align-items: center;
    gap: 8px;
    font-size: 13px;
    color: var(--text-2);
    min-width: 0;
}
.crumb b {
    color: var(--text);
    font-weight: 500;
}
.sep {
    color: var(--text-3);
}
.crumb-link {
    color: var(--text-2);
}
.crumb-link:hover {
    color: var(--text);
}
.help-btn {
    width: 22px;
    height: 22px;
    margin-left: -4px;
    color: var(--text-3);
}
.help-btn .ico {
    width: 14px;
    height: 14px;
}
.icon-btn {
    position: relative;
    width: 28px;
    height: 28px;
    border-radius: 6px;
    display: flex;
    align-items: center;
    justify-content: center;
    color: var(--text-3);
    background: transparent;
    border: none;
    padding: 0;
}
.icon-btn:hover,
.icon-btn.on {
    background: var(--hover);
    color: var(--text);
}
.icon-btn.on {
    background: var(--sel);
}
.icon-btn .ico {
    width: 15px;
    height: 15px;
}
.tool-badge {
    position: absolute;
    top: -2px;
    right: -3px;
    min-width: 15px;
    height: 15px;
    padding: 0 4px;
    border-radius: 8px;
    background: var(--accent);
    color: #fff;
    font-size: 10px;
    line-height: 15px;
    text-align: center;
    pointer-events: none;
}
.drop-wrap {
    position: relative;
}

.drop {
    --rail-gutter: 12px;
    --rail-tabs-top: 0px;
    position: absolute;
    right: 0;
    top: 34px;
    z-index: 30;
    width: 340px;
    max-height: 60vh;
    display: flex;
    flex-direction: column;
    overflow: hidden auto;
    border: 1px solid var(--border-2);
    border-radius: 10px;
    background: var(--side);
    box-shadow: 0 16px 40px rgba(0, 0, 0, 0.45);
}

.drop-head {
    flex: none;
    padding: 8px 12px;
    font-size: 12.5px;
    color: var(--text-2);
}

.drop-enter-active {
    transition:
        opacity 0.16s ease-out,
        transform 0.16s cubic-bezier(0.2, 0.8, 0.2, 1);
}

.drop-leave-active {
    transition:
        opacity 0.12s ease-in,
        transform 0.12s ease-in;
}

.drop-enter-from,
.drop-leave-to {
    opacity: 0;
    transform: translateY(-4px);
}
</style>
