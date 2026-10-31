<script setup>
import {ref} from "vue";
import Btn from "../kit/Btn.vue";
import FloatWindow from "../kit/FloatWindow.vue";
import PaneMenuOptions from "../panes/PaneMenuOptions.vue";
import WindowPane from "../windows/WindowPane.vue";

const props = defineProps({
    detached: {type: Object, required: true},
    catalogue: {type: Object, required: true},
    subscriptions: {type: Object, required: true},
    environment: {type: String, required: true},
    agent: {type: Number, default: null},
    prompts: {type: Object, default: null},
    shellRead: {type: Function, default: null},
});

const {floats, move, size, tune, front, dock, sendAway} = props.detached;
const menu = ref(null);
const entryOf = (f) => props.catalogue.window(f.view);

function away(id) {
    menu.value = null;
    sendAway(id);
}
</script>

<template>
    <div class="detached">
        <template v-for="f in floats" :key="f.id">
            <FloatWindow
                :x="f.x"
                :y="f.y"
                :w="f.w"
                :h="f.h"
                :title="entryOf(f)?.title || f.view"
                :icon="entryOf(f)?.icon || 'window'"
                :minimized="Boolean(f.minimized)"
                @front="front(f.id)"
                @move="(to) => move(f.id, to)"
                @size="(to) => size(f.id, to)"
                @dock="dock(f.id)"
                @menu="menu = menu === f.id ? null : f.id"
                @minimize="(minimized) => tune(f.id, {minimized})"
            >
                <template v-if="menu === f.id">
                    <div class="float-menu" role="menu">
                        <PaneMenuOptions :declared="entryOf(f)?.options || []" :values="f.options || {}" @set="(key, value) => tune(f.id, {options: {...(f.options || {}), [key]: value}})" />
                        <Btn :data-float-away="f.id" @click="away(f.id)">Send away</Btn>
                    </div>
                </template>
                <WindowPane
                    :name="f.view"
                    :catalogue="catalogue"
                    :subscriptions="subscriptions"
                    :environment="environment"
                    :agent="agent"
                    :options="f.options || {}"
                    :prompts="prompts"
                    :shell-read="shellRead"
                />
            </FloatWindow>
        </template>
    </div>
</template>

<style scoped>
.detached {
    position: fixed;
    inset: 0;
    z-index: 60;
    pointer-events: none;
}

.detached > :deep(*) {
    pointer-events: auto;
}

.float-menu {
    display: flex;
    flex-wrap: wrap;
    gap: 4px;
    padding: 6px;
    border-bottom: 1px solid var(--line);
}
</style>
