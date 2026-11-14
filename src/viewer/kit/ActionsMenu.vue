<script setup>
import {PAGE_TOASTS} from "./useToast.js";
import {useContextMenu} from "../src/composables/contextMenu.js";
import Btn from "../src/kit/Btn.vue";
import ContextMenu from "../src/kit/ContextMenu.vue";
import Icon from "../src/kit/Icon.vue";

// the Actions button of a page or a reader: it opens the same menu as a right click, under the button, with the same items
// ({label, group, danger, armedLabel, disabled, reason, children, run({say})}), and what an item did is said in the toast of the page
const props = defineProps({items: {type: Array, required: true}, head: {type: String, default: ""}, label: {type: String, default: "Actions"}});
const {menu, show, close} = useContextMenu();
const say = (text, undo = null) => globalThis[PAGE_TOASTS]?.raise(text, undo);
const withSay = (items) => items.map((item) => ({...item, run: item.run && (() => item.run({say})), children: item.children && withSay(item.children)}));

function open(event) {
    const box = event.currentTarget.getBoundingClientRect();
    show({x: box.left, y: box.bottom + 2, flipX: box.right}, props.head, withSay(props.items), event.currentTarget);
}
</script>

<template>
    <Btn small aria-haspopup="menu" :aria-expanded="Boolean(menu)" data-actions-menu @click="open">{{ label }}<Icon name="chevronRight" :size="11" facing="down" /></Btn>
    <ContextMenu v-if="menu" v-bind="menu" @close="close" />
</template>
