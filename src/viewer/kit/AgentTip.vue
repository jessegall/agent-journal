<script setup>
import {computed, inject, ref} from "vue";
import HoverTip from "../src/kit/HoverTip.vue";
import {WINDOW_CONTEXT} from "./windowContextKey.js";
import {agentTipRead} from "./agentTipRead.js";
import {agentIdentity, agentLook, seenWords, sinceWords} from "./agentTipWords.js";

// the one tooltip of an agent, for its icon or its name wherever it shows: its type and name, its program line, whether it works now, and since
// when and when it was last seen; it reads the agent when the mouse or the keyboard first reaches it, never when a list is drawn
const props = defineProps({agentId: {type: Number, required: true}, label: {type: String, default: ""}, as: {type: String, default: "span"}, place: {type: String, default: "left"}});
const context = inject(WINDOW_CONTEXT, null);
const armed = ref(false);
const tip = ref(null);
const failure = ref("");
const readAt = ref(Date.now());
const look = computed(() => agentLook(tip.value));
const since = computed(() => sinceWords(tip.value.since, readAt.value));
const seen = computed(() => seenWords(tip.value.last_seen, readAt.value));

async function load() {
    armed.value = true;
    if (!context) return;
    const answer = await agentTipRead(context, props.agentId);
    failure.value = answer.ok ? "" : answer.error;
    if (!answer.ok) return;
    readAt.value = Date.now();
    tip.value = answer.value;
}
</script>

<template>
    <HoverTip :as="as" :place="place" class="agent-tip" data-agent-tip @mouseenter="load" @focusin="load">
        <slot />
        <template v-if="armed" #tip>
            <template v-if="tip">
                <span class="line head" data-agent-tip-head><b>{{ tip.title }}</b><template v-if="tip.name"> {{ tip.name }}</template></span>
                <span class="line" data-agent-tip-identity>{{ agentIdentity(tip) }}</span>
                <span class="line status" data-agent-tip-status><i :data-state="look.state" />{{ look.words }}</span>
                <template v-if="since"><span class="line" data-agent-tip-since>{{ since }}</span></template>
                <template v-if="seen"><span class="line" data-agent-tip-seen>{{ seen }}</span></template>
            </template>
            <template v-else>
                <b class="line" data-agent-tip-head>{{ label }}</b>
            </template>
            <template v-if="failure"><span class="line failure" data-agent-tip-failure>{{ failure }}</span></template>
        </template>
    </HoverTip>
</template>

<style scoped>
.agent-tip { position: relative; }
.line { display: block; }
.status { display: flex; gap: 6px; align-items: center; }
.status i { flex: none; width: 8px; height: 8px; border-radius: 50%; background: var(--text-3); }
.status i[data-state="working"] { background: var(--accent); }
.status i[data-state="limited"] { background: var(--paused); }
.status i[data-state="retired"] { background: none; box-shadow: inset 0 0 0 1.5px var(--text-3); }
.failure { color: var(--danger); }
</style>
