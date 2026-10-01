<script setup>
import PhoneAgent from "./PhoneAgent.vue";
import PhoneAtWorkChip from "./PhoneAtWorkChip.vue";
import PhoneChevron from "./PhoneChevron.vue";
import PhoneNotify from "./PhoneNotify.vue";
import PhoneWaiting from "./PhoneWaiting.vue";

const props = defineProps({
    connection: {type: Object, required: true},
    feed: {type: Object, required: true},
    under: {type: Boolean, default: false},
    offline: {type: Boolean, default: false},
    current: {type: Boolean, default: false},
    newer: {type: Boolean, default: false},
    notice: {type: String, default: ""},
    actionsHere: {type: Number, default: 0},
});
const emit = defineEmits(["places", "agent", "at-work", "reload", "open", "list"]);
</script>

<template>
    <div :class="['home-top', {under}]">
        <header class="home-bar">
            <button type="button" class="home-names" aria-label="Switch journal or environment" @click="emit('places')">
                <span class="home-title">
                    <span class="home-dot" :style="{background: connection.color}" />
                    <span class="home-project">{{ connection.project }}</span>
                    <PhoneChevron facing="down" :size="12" class="home-chevron" />
                </span>
                <span :class="['home-note', {offline}]">
                    <template v-if="offline">
                        <span class="home-offline-dot" aria-hidden="true" />
                    </template>
                    {{ connection.environment }}{{ offline ? " · Offline, waiting to reconnect" : current ? "" : " · Updating…" }}
                </span>
            </button>
            <PhoneAtWorkChip :live="feed.running || {}" @open="emit('at-work')" />
            <button type="button" class="home-agent" aria-haspopup="dialog" @click="emit('agent')">
                <span class="phone-hidden">Agent:</span>
                <PhoneAgent :state="feed.agent" :auto="Boolean(feed.running?.auto)" />
            </button>
        </header>
        <template v-if="newer">
            <p class="home-newer">
                A newer version of this app is ready.
                <button type="button" @click="emit('reload')">Reload now</button>
            </p>
        </template>
        <template v-if="notice">
            <p class="home-offline" role="status">{{ notice }}</p>
        </template>
        <template v-if="actionsHere">
            <p class="home-pending" role="status">
                {{ actionsHere === 1 ? "1 of your actions waits" : `${actionsHere} of your actions wait` }} to send
            </p>
        </template>
        <PhoneNotify />
        <PhoneWaiting :waiting="feed.waiting" @open="(target) => emit('open', target)" @list="emit('list')" />
    </div>
</template>

<style scoped>
.home-top {
    flex: none;
    max-width: none;
    margin: 0 calc(-1 * var(--side));
    padding: 0 var(--side);
    border-bottom: 1px solid transparent;
    transition: border-color 200ms linear;
}

.home-top.under {
    border-bottom-color: var(--line);
}

.home-bar {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 10px;
    min-height: 52px;
}

.home-names {
    min-width: 0;
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    min-height: 44px;
    justify-content: center;
    padding: 0;
    border: 0;
    background: transparent;
    color: inherit;
    font: inherit;
    text-align: left;
}

.home-chevron {
    flex: none;
    color: var(--text-3);
}

.home-dot {
    flex: none;
    width: 9px;
    height: 9px;
    border-radius: 50%;
}

.home-title {
    display: flex;
    align-items: center;
    gap: 7px;
    font-size: 1rem;
    font-weight: 600;
}

.home-project {
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
}

.home-note {
    max-width: 100%;
    overflow: hidden;
    padding-left: 16px;
    text-overflow: ellipsis;
    white-space: nowrap;
    color: var(--text-3);
    font-size: 0.765rem;
}

.home-agent {
    flex: none;
    min-height: 44px;
    padding: 0;
    border: 0;
    background: none;
    color: inherit;
    font: inherit;
}

.home-newer {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 8px;
    margin: 0 0 8px;
    padding: 6px 6px 6px 14px;
    border-radius: 18px;
    background: var(--accent-dim);
    color: var(--text);
    font-size: 0.765rem;
    line-height: 1.3;
}

.home-newer button {
    flex: none;
    min-height: 30px;
    padding: 0 12px;
    border: 0;
    border-radius: 15px;
    background: var(--accent);
    color: #fff;
    font: inherit;
    font-weight: 600;
}

.home-note.offline {
    color: var(--text-2);
}

.home-offline-dot {
    display: inline-block;
    width: 7px;
    height: 7px;
    margin-right: 4px;
    border-radius: 50%;
    background: var(--tone-warn);
    vertical-align: middle;
}

.home-pending {
    margin: 0 0 6px;
    padding: 6px 12px;
    border-radius: 14px;
    background: var(--raised);
    color: var(--text-2);
    font-size: 0.824rem;
}

.home-offline {
    max-width: none;
    margin: 0 calc(-1 * var(--side));
    padding: 8px var(--side);
    background: color-mix(in oklab, var(--tone-warn) 16%, transparent);
    color: var(--text);
    font-size: 0.824rem;
    line-height: 1.35;
}
</style>
