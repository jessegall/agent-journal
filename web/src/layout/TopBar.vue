<script setup>
import {computed} from "vue";
import Icon from "../kit/Icon.vue";
import {go, route} from "../route.js";
import {meta, store, unreadByUser} from "../store.js";

const title = computed(() =>
    !route.value.page
        ? "Home"
        : route.value.page === "settings"
          ? "Settings"
          : route.value.page === "search"
            ? "Search"
            : `${meta(route.value.page).title}s`
);
const waiting = computed(() => unreadByUser("notification").length);
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
            <button type="button" class="icon-btn" title="Notifications" @click="go(route.env)">
                <Icon name="bell" />
                <template v-if="waiting">
                    <span class="tool-badge">{{ waiting }}</span>
                </template>
            </button>
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
</style>
