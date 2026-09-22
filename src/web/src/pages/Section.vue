<script setup lang="ts">
import Btn from "../kit/Btn.vue";
import {store} from "../state/store.js";
import {load, rows} from "../sync/rows.js";

defineEmits<{saveColor: [unknown]}>();
</script>

<template>
    <span class="control color-control">
        <input
            class="color"
            type="color"
            :value="store.identity.color"
            aria-label="Project color"
            @change="$emit('saveColor', $event.target.value)"
        />
        <template v-if="store.identity.custom_color">
            <Btn small @click="$emit('saveColor', null)">Reset</Btn>
        </template>
    </span>
</template>
