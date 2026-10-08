<script setup>
import {onMounted, ref} from "vue";
import {loadMe, me} from "../composables/me.js";
import Icon from "../kit/Icon.vue";
import PeopleDialog from "./PeopleDialog.vue";

const open = ref(false);

onMounted(loadMe);
</script>

<template>
    <template v-if="me">
        <button type="button" class="icon-btn" aria-label="People" v-tip="'People who can log in to this journal'" @click="open = true">
            <Icon name="people" />
        </button>
    </template>
    <template v-if="open">
        <PeopleDialog :me="me" @close="open = false" />
    </template>
</template>
