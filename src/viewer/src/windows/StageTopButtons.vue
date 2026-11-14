<script setup>
import Btn from "../kit/Btn.vue";
import Icon from "../kit/Icon.vue";
import ColorSchemePicker from "../shell/ColorSchemePicker.vue";
import {onMounted, onUnmounted} from "vue";

// the buttons of the top bar: the sidebar, search, what waits on you, phones, the color scheme, full screen and the activity panel
defineProps({waiting: {type: Number, default: 0}, pairedPhones: {type: Array, required: true}});
const emit = defineEmits(["sidebar", "view", "count", "activity", "wide"]);
const SEARCH_PAGE = "search.search";
// Command or Control and K opens search from anywhere on the page, as the hint in the search field says
function searchKey(event) {
    if (!(event.metaKey || event.ctrlKey) || event.key.toLowerCase() !== "k") return;
    event.preventDefault();
    emit("view", SEARCH_PAGE);
}
onMounted(() => window.addEventListener("keydown", searchKey));
onUnmounted(() => window.removeEventListener("keydown", searchKey));
</script>

<template>
<Btn variant="icon" data-top-side aria-label="Show or hide the sidebar" title="Show or hide the sidebar" @click="emit('sidebar')"><Icon name="list" :size="13" /></Btn>
<button type="button" class="top-search" data-top-search aria-label="Search" title="Search" @click="emit('view', SEARCH_PAGE)">
    <Icon name="search" :size="13" /><span class="top-search-text">Search</span><kbd class="top-search-key" data-top-search-key>⌘K</kbd>
</button>
<Btn variant="icon" class="top-bell" data-top-bell aria-label="Pending requests" title="Pending requests" @click="emit('count', 'waiting')">
    <Icon name="bell" :size="13" />
    <template v-if="waiting">
        <span class="top-bell-count" data-top-bell-count>{{ waiting }}</span>
    </template>
</Btn>
<Btn variant="icon" class="top-bell" data-top-phone aria-label="Phones" :title="pairedPhones.length ? `${pairedPhones[0].name} is connected` : 'Connect your phone'" @click="emit('view', 'phone.phones')">
    <Icon name="phone" :size="13" />
    <template v-if="pairedPhones.length">
        <span class="top-phone-dot" data-top-phone-dot />
    </template>
</Btn>
<ColorSchemePicker />
<Btn variant="icon" data-fullscreen aria-label="Full screen" title="Full screen" @click="emit('wide')">
    <Icon name="wide" :size="13" />
</Btn>
<Btn variant="icon" data-activity-toggle aria-label="Activity" title="Activity" @click="emit('activity')"><Icon name="activity" :size="13" /></Btn>
</template>

<style scoped>
.top-search {
    display: flex;
    align-items: center;
    gap: 8px;
    width: 200px;
    height: 28px;
    padding: 0 8px;
    border: 1px solid var(--border);
    border-radius: 7px;
    background: var(--raised);
    color: var(--text-3);
    font: inherit;
    font-size: 12px;
    cursor: pointer;
}

.top-search:hover {
    color: var(--text-2);
}

.top-search-text {
    flex: 1;
    text-align: left;
}

.top-search-key {
    padding: 0 4px;
    border: 1px solid var(--border);
    border-radius: 4px;
    font: inherit;
    font-size: 11px;
}

.top-bell {
    position: relative;
}

.top-phone-dot {
    position: absolute;
    top: 3px;
    right: 3px;
    width: 6px;
    height: 6px;
    border-radius: 50%;
    background: var(--ok, var(--accent));
}

.top-bell-count {
    position: absolute;
    top: -3px;
    right: -3px;
    min-width: 13px;
    border-radius: 7px;
    background: var(--accent);
    color: #fff;
    font-size: 9px;
    line-height: 13px;
    text-align: center;
}
</style>
