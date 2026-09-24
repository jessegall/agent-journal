<script setup>
import {computed, ref} from "vue";
import Icon from "../kit/Icon.vue";
import MenuItem from "../kit/MenuItem.vue";
import MenuPanel from "../kit/MenuPanel.vue";
import {pageTitle} from "../composables/pageTitle.js";
import {useNavigation} from "../composables/navigation.js";
import {go, route} from "../route.js";

const {sections, groups} = useNavigation();
const anchor = ref(null);
const lists = computed(() => [
    ...sections.value.map((s) => ({key: s.key, title: s.label, links: s.links})),
    ...groups.value.map((g) => ({key: g.key, title: g.title, links: g.links})),
]);

const toggle = (e) => (anchor.value = anchor.value ? null : e.currentTarget);

function jump(page) {
    anchor.value = null;
    go(route.value.env, page);
}
</script>

<template>
    <button type="button" :class="['page-jump', {open: anchor}]" :aria-expanded="!!anchor" title="Go to another page" @click="toggle">
        {{ pageTitle }}
        <Icon name="caret" :size="12" />
    </button>
    <template v-if="anchor">
        <MenuPanel :anchor="anchor" :min-width="220" :max-width="260" :max-height="560" @click.stop @close="anchor = null">
            <template v-for="(list, at) in lists" :key="list.key">
                <p :class="['page-jump-head', {first: !at}]">{{ list.title }}</p>
                <template v-for="link in list.links" :key="link.key">
                    <MenuItem :on="(route.page || '') === link.page" @click="jump(link.page)">
                        <Icon :name="link.icon" :size="14" />
                        {{ link.title }}
                    </MenuItem>
                </template>
            </template>
        </MenuPanel>
    </template>
</template>

<style scoped>
.page-jump {
    display: inline-flex;
    align-items: center;
    gap: 4px;
    margin-left: 4px;
    padding: 2px 6px;
    border: 0;
    border-radius: 5px;
    background: none;
    color: var(--text-3);
    font: inherit;
    font-size: 11.5px;
    cursor: pointer;
}

.page-jump:hover,
.page-jump.open {
    background: var(--hover);
    color: var(--text);
}

.page-jump-head {
    margin: 8px 8px 2px;
    color: var(--text-4);
    font-size: 10.5px;
    font-weight: 500;
    letter-spacing: 0.04em;
    text-transform: uppercase;
}

.page-jump-head.first {
    margin-top: 2px;
}
</style>
