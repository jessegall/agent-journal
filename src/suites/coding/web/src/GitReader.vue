<script setup>
import {computed} from "vue";
import {ActionsMenu, Btn, Reader} from "@journal/window-kit";
import {facts} from "./gitItems.js";

// one commit, branch or pull request read whole: its facts, Show changes as the primary and the Actions menu
const props = defineProps({item: {type: Object, required: true}, items: {type: Array, required: true}});
const emit = defineEmits(["changes"]);
const NUMBERS = {commit: "Commit", branch: "Branch", pull: "Pull request"};
const number = computed(() => (props.item.kind === "pull" ? `#${props.item.row.number}` : NUMBERS[props.item.kind]));
</script>

<template>
    <Reader :title="item.kind === 'pull' ? item.row.title : item.title" :number="number" :facts="facts(item)" data-git-reader>
        <template #primary>
            <Btn small variant="primary" data-git-changes @click="emit('changes')">Show changes</Btn>
        </template>
        <template #actions>
            <ActionsMenu :items="items" :head="item.title" />
        </template>
    </Reader>
</template>
