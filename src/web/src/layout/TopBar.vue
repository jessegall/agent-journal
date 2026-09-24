<script setup>
import CountBadge from "../kit/CountBadge.vue";
import {computed, onUnmounted, ref} from "vue";
import Icon from "../kit/Icon.vue";
import RailWaiting from "../pages/RailWaiting.vue";
import ShareTunnel from "./ShareTunnel.vue";
import {openShares, waitingShares} from "../composables/shares.js";
import {route} from "../route.js";
import {unreadByUser} from "../domain/records.js";
import {meta, store, types} from "../state/store.js";
import {useOutside} from "../composables/outside.js";
import {activityShown, toggleActivity} from "../actions/panels.js";
import {narrow} from "../platform/view.js";
import {project, tint} from "../identity.js";
import {pageTitle as title} from "../composables/pageTitle.js";
import {useFloatingChat} from "../composables/floatingChat.js";

const waiting = computed(() => types.value.filter((t) => t.needs_attention).flatMap((t) => unreadByUser(t.name)).length);
const drop = ref(false);
const wrap = ref(null);
useOutside(wrap, () => (drop.value = false));
const full = computed(() => route.value.page === "kanban");
const {floatingChat, toggleChat} = useFloatingChat();
</script>

<template>
    <div class="top">
        <div class="crumb">
            <template v-if="narrow">
                <button type="button" class="icon-btn" title="Open the menu" @click="store.sideOpen = !store.sideOpen">
                    <Icon name="list" />
                </button>
            </template>
            <template v-if="full">
                <a class="icon-btn back" :href="`#/${route.env}`" title="Back to Home"><Icon name="back" /></a>
            </template>
            <a class="crumb-link crumb-project" :href="`#/${route.env}/hub`" title="The journals running on this machine">
                <span class="crumb-tint" :style="{background: tint}" />
                {{ project }}
            </a>
            <span class="sep">/</span>
            <a class="crumb-link" :href="`#/${route.env}`">{{ route.env }}</a>
            <span class="sep">/</span>
            <b>{{ title }}</b>
            <template v-if="route.page && meta(route.page)">
                <span class="icon-btn help-btn" :title="meta(route.page).help"><Icon name="info" /></span>
            </template>
        </div>
        <div class="top-tools">
            <button
                type="button"
                :class="['icon-btn', {on: floatingChat}]"
                :title="floatingChat ? 'Close the floating chat' : 'Open the chat in a floating window'"
                @click="toggleChat"
            >
                <Icon name="chat" />
            </button>
            <template v-if="openShares.length || waitingShares.length">
                <ShareTunnel />
            </template>
            <a class="icon-btn" :href="`#/${route.env}/search`" title="Search"><Icon name="search" /></a>
            <div ref="wrap" class="drop-wrap">
                <button type="button" :class="['icon-btn', {on: drop}]" title="Notifications" :aria-expanded="drop" @click="drop = !drop">
                    <Icon name="bell" />
                    <template v-if="waiting">
                        <CountBadge :count="waiting" />
                    </template>
                </button>
                <Transition name="drop">
                    <div v-if="drop" class="drop" @click="(e) => e.target.closest('.needs-card') && (drop = false)">
                        <div class="drop-head">Notifications</div>
                        <RailWaiting />
                    </div>
                </Transition>
            </div>
            <template v-if="!full">
                <button
                    type="button"
                    :class="['icon-btn', {on: activityShown()}]"
                    :title="activityShown() ? 'Hide Activity' : 'Show Activity'"
                    @click="toggleActivity"
                >
                    <Icon name="activity" />
                </button>
            </template>
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
.crumb-project {
    display: inline-flex;
    align-items: center;
    gap: 6px;
}

.crumb-tint {
    flex: none;
    width: 8px;
    height: 8px;
    border-radius: 2px;
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
.icon-btn.back {
    margin-left: -7px;
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
.drop-wrap {
    position: relative;
}

.drop {
    --rail-gutter: 12px;
    --rail-tabs-top: 0px;
    position: absolute;
    right: 0;
    top: 34px;
    z-index: 95;
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
</style>
