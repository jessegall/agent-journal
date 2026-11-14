<script setup>
import {onMounted, onUnmounted} from "vue";
import {PAGE_TOASTS} from "../../kit/useToast.js";
import {useContextMenu} from "../composables/contextMenu.js";
import {makeToasts} from "../composables/toasts.js";
import {watchRightClicks} from "../platform/rightClick.js";
import ContextMenu from "../kit/ContextMenu.vue";
import ToastArea from "../kit/ToastArea.vue";

// the one menu and the one listener of the whole page, in a root of their own over the app: a right click opens the menu of the place under the pointer.
// What an item did is said in the toast of the page that shows them, or in this host's own where the page has none.
const {menu, show, close} = useContextMenu();
const own = makeToasts(async () => ({ok: false, error: "Nothing to undo here"}));
const say = (text) => (globalThis[PAGE_TOASTS] ?? own).raise(text);
let stop = () => {};
onMounted(() => (stop = watchRightClicks({show, say})));
onUnmounted(() => stop());
</script>

<template>
    <ContextMenu v-if="menu" v-bind="menu" @close="close" />
    <ToastArea :toasts="own" />
</template>
