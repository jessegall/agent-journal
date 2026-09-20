<script setup lang="ts">
import {COUNTED, EVENTS} from "./cadence.js";

defineProps<{f: unknown}>();
defineEmits<{marks: [unknown, unknown]; every: [unknown, unknown]; unit: [unknown, unknown]}>();
</script>

<template>
    <span class="cadence">
        <template v-if="f.when.at">
            <span class="note">at</span>
            <input class="days marks" :value="f.when.at.join(', ')" @change="$emit('marks', f, $event.target.value)" />
            <span class="note">percent</span>
        </template>
        <template v-else-if="f.when.on">
            <span class="note">on</span>
        </template>
        <template v-else>
            <span class="note">every</span>
            <input class="days" type="number" min="1" :value="f.when.every" @change="$emit('every', f, $event.target.value)" />
        </template>
        <span class="units">
            <template v-for="u in [...COUNTED, ...EVENTS]" :key="u">
                <button
                    type="button"
                    :class="['unit-pick', {on: f.when.on ? f.when.on === u : f.when.unit === u}]"
                    @click="$emit('unit', f, u)"
                >
                    {{ u }}
                </button>
            </template>
        </span>
    </span>
</template>
