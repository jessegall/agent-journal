<script setup>
import Btn from "../kit/Btn.vue";
import Icon from "../kit/Icon.vue";
import ColorSchemePicker from "../shell/ColorSchemePicker.vue";

// the buttons of the top bar: the sidebar, search, what waits on you, phones, the color scheme, full screen and the activity panel
defineProps({waiting: {type: Number, default: 0}, pairedPhones: {type: Array, required: true}});
const emit = defineEmits(["sidebar", "view", "count", "activity", "wide"]);
</script>

<template>
<Btn variant="icon" data-top-side aria-label="Show or hide the sidebar" title="Show or hide the sidebar" @click="emit('sidebar')"><Icon name="list" :size="13" /></Btn>
<Btn variant="icon" data-top-search aria-label="Search" title="Search" @click="emit('view', 'search.search')"><Icon name="search" :size="13" /></Btn>
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
