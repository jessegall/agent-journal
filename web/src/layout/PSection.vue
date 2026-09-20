<script setup lang="ts">
import {act, saveSettings} from "../api.js";
import Icon from "../kit/Icon.vue";
import {go, peek, route} from "../route.js";
import {currentWork, doneOf, lineOf, phaseOf, planButton, queued, rowsOf, shownPlans, stateOf, wordOf} from "./statusline.js";

defineProps<{plans: unknown; error: string; data: unknown; p: unknown}>();
defineEmits<{runBar: [unknown]}>();
</script>

<template>
    <div :class="['planbar', `planbar-${data.status}`]">
        <a class="planbar-link" :href="`#/${route.env}/plan/${p.n}`" :title="`Plan ${p.n}: ${p.title}`">
            <span class="planbar-n">Plan</span>
            <span class="planbar-dot">·</span>
            <span class="planbar-title">{{ p.title }}</span>
            <template v-if="phaseOf(p)">
                <span class="planbar-dot">·</span>
                <span class="planbar-phase">{{ phaseOf(p) }}</span>
            </template>
            <span class="planbar-step">{{ data.current || 1 }}/{{ data.phases.length }}</span>
            <span class="planbar-track" role="progressbar">
                <span :style="{width: `${(100 * done(p)) / Math.max(1, rowsOf(p).length)}%`}" />
            </span>
        </a>
        <template v-if="planButton(p)">
            <button type="button" :class="['planbar-act', {ack: data.status === 'done'}]" @click="$emit('runBar', p)">
                {{ planButton(p)[1] }}
                <Icon name="arrow" />
            </button>
        </template>
        <template v-if="error">
            <span class="planbar-error">{{ error }}</span>
        </template>
    </div>
</template>
