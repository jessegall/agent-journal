<script setup>
import {meta} from "../domain/tables.js";
import {sharingOn} from "../composables/settings.js";
import {store} from "../state/store.js";
import CountBadge from "../kit/CountBadge.vue";
import {ref} from "vue";
import Icon from "../kit/Icon.vue";
import RailWaiting from "../rail/RailWaiting.vue";
import ShareTunnel from "./ShareTunnel.vue";
import PhoneDialog from "./PhoneDialog.vue";
import {connectedPhones, loadPhones} from "../composables/phones.js";
import {usePoll} from "../composables/poll.js";
import {href, route} from "../route.js";
import {waitingCount} from "../domain/records.js";
import {useOutside} from "../composables/outside.js";
import {activityVisible, toggleActivity} from "../actions/panels.js";
import {narrow} from "../platform/view.js";
import {project, tint} from "../state/identity.js";
import {pageTitle as title} from "../composables/pageTitle.js";
import {useFloatingChat} from "../composables/floatingChat.js";

const drop = ref(false);
const wrap = ref(null);
useOutside(wrap, () => (drop.value = false));
const {floatingChat, toggleChat} = useFloatingChat();
const phoneOpen = ref(false);
const PHONES_EVERY = 30000;
usePoll("phones", () => (sharingOn.value ? loadPhones() : null), PHONES_EVERY);
</script>

<template>
    <div class="top">
        <div class="crumb">
            <template v-if="narrow">
                <button type="button" class="icon-btn" v-tip="'Open the menu'" @click="store.sideOpen = !store.sideOpen">
                    <Icon name="list" />
                </button>
            </template>
            <a class="crumb-link crumb-project" :href="href.page()">
                <span class="crumb-tint" :style="{background: tint}" />
                <span class="crumb-name">{{ project }}</span>
            </a>
            <span class="sep crumb-wide">/</span>
            <a class="crumb-link" :href="href.page()">{{ route.env }}</a>
            <span class="sep crumb-wide">/</span>
            <b class="crumb-wide">{{ title }}</b>
            <template v-if="route.page && meta(route.page)">
                <span class="icon-btn help-btn" v-tip="meta(route.page).abstract"><Icon name="info" /></span>
            </template>
        </div>
        <div class="top-tools">
            <button
                type="button"
                :class="['icon-btn', {on: floatingChat}]"
                v-tip="floatingChat ? 'Close the floating chat' : 'Open the chat in a floating window'"
                @click="toggleChat"
            >
                <Icon name="chat" />
            </button>
            <template v-if="sharingOn">
                <ShareTunnel />
                <button
                    type="button"
                    :class="['icon-btn', {on: phoneOpen}]"
                    v-tip="connectedPhones.length ? `${connectedPhones[0].name} is connected` : 'Connect your phone'"
                    @click="phoneOpen = true"
                >
                    <Icon name="phone" />
                    <template v-if="connectedPhones.length">
                        <span class="phone-dot" />
                    </template>
                </button>
                <template v-if="phoneOpen">
                    <PhoneDialog @close="phoneOpen = false" />
                </template>
            </template>
            <a class="icon-btn" :href="href.page('search')" v-tip="'Search'"><Icon name="search" /></a>
            <div ref="wrap" class="drop-wrap">
                <button type="button" :class="['icon-btn', {on: drop}]" v-tip="'Notifications'" :aria-expanded="drop" @click="drop = !drop">
                    <Icon name="bell" />
                    <template v-if="waitingCount()">
                        <CountBadge :count="waitingCount()" />
                    </template>
                </button>
                <Transition name="drop">
                    <div v-if="drop" class="drop" @click="(e) => e.target.closest('.needs-card') && (drop = false)">
                        <div class="drop-head">Notifications</div>
                        <RailWaiting />
                    </div>
                </Transition>
            </div>
            <button
                type="button"
                :class="['icon-btn', {on: activityVisible()}]"
                v-tip="activityVisible() ? 'Hide activity' : 'Show activity'"
                @click="toggleActivity"
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
    overflow: hidden;
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

@media (max-width: 640px) {
    .crumb-name,
    .crumb-wide {
        display: none;
    }
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


.phone-dot {
    position: absolute;
    right: 4px;
    bottom: 5px;
    width: 6px;
    height: 6px;
    border: 1.5px solid var(--bg);
    border-radius: 50%;
    background: var(--tone-good);
}
</style>
