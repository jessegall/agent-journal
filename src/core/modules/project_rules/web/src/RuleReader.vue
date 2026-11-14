<script setup>
import {computed} from "vue";
import {ActionsMenu, Btn, Reader} from "@journal/window-kit";
import {STATE_WORDS} from "./ruleWords.js";

// one rule read whole: its number in the head, its words as the title, the facts, Approve when it waits for a user, and the Actions menu
const props = defineProps({rule: {type: Object, required: true}, items: {type: Array, required: true}});
const emit = defineEmits(["approve"]);
const facts = computed(() => [
    {name: "state", label: "State", value: STATE_WORDS[props.rule.state] ?? props.rule.state},
    {name: "made", label: "Made", value: props.rule.created_at, isTime: true},
]);
</script>

<template>
    <Reader :title="rule.text" :number="String(rule.id)" :facts="facts" data-rule-reader>
        <template #agent>
            <template v-if="rule.state === 'removed'"><span class="badge-quiet" data-rule-removed>Removed</span></template>
        </template>
        <template #primary>
            <template v-if="rule.state === 'proposed'"><Btn small variant="primary" data-rule-approve @click="emit('approve')">Approve</Btn></template>
        </template>
        <template #actions>
            <ActionsMenu :items="items" :head="`Rule ${rule.id}`" />
        </template>
    </Reader>
</template>
