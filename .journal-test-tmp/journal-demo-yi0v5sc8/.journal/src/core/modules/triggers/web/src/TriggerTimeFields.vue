<script setup>
import {TIMES} from "./triggerWords.js";
import TriggerTiles from "./TriggerTiles.vue";

// when a time trigger comes: the choice of how is made once, when the trigger is new
defineProps({isNew: {type: Boolean, required: true}});
const time = defineModel("time", {type: String, required: true});
const every = defineModel("every", {type: String, required: true});
const at = defineModel("at", {type: String, required: true});
const cron = defineModel("cron", {type: String, required: true});
const limit = defineModel("limit", {type: String, required: true});
</script>

<template>
    <template v-if="isNew">
        <TriggerTiles v-model="time" :options="TIMES" mark="trigger-time" />
    </template>
    <template v-if="time === 'once'">
        <label class="field"><span class="label">Date and time</span><input v-model="at" type="datetime-local" data-trigger-at></label>
    </template>
    <template v-else>
        <div class="two">
            <template v-if="time === 'every'">
                <label class="field"><span class="label">Interval (minutes)</span><input :value="every" type="number" min="1" data-trigger-every @input="every = $event.target.value"></label>
            </template>
            <template v-else>
                <label class="field"><span class="label">Cron line</span><input v-model="cron" placeholder="0 9 * * 1-5" data-trigger-cron></label>
            </template>
            <label class="field"><span class="label">Maximum runs</span><input :value="limit" type="number" min="1" placeholder="Empty means no limit" data-trigger-limit @input="limit = $event.target.value"></label>
        </div>
    </template>
</template>

<style scoped src="./triggerForm.css"></style>
