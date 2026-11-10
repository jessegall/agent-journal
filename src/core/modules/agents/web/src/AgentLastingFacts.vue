<script setup>
import {computed} from "vue";
import {TimeAgo} from "@journal/window-kit";

const END_REASONS = {cache_passed: "its cache had passed", each_launch: "each job starts a new one", driver_changed: "its driver was changed", replaced_by_person: "a person replaced it", launch_rotation: "its program was changed for the job"};
const props = defineProps({row: {type: Object, required: true}});
const programName = computed(() => (props.row.program ? props.row.program.slice(0, 1).toUpperCase() + props.row.program.slice(1) : ""));
const driver = computed(() => [programName.value, props.row.program_model].filter(Boolean).join(" "));
const endReason = computed(() => (props.row.replaced_session_end_reason ? END_REASONS[props.row.replaced_session_end_reason] || props.row.replaced_session_end_reason.replaceAll("_", " ") : ""));
</script>

<template>
    <dl class="lasting-facts" data-agent-lasting-facts>
        <template v-if="driver"><div><dt>Driver</dt><dd data-agent-driver-name>{{ driver }}</dd></div></template>
        <div><dt>Sessions</dt><dd data-agent-session-count>{{ row.session_count ?? 0 }}</dd></div>
        <div><dt>Memories</dt><dd data-agent-memory-count>{{ row.memory_count ?? 0 }}</dd></div>
        <template v-if="endReason"><div><dt>Last session ended</dt><dd data-agent-session-end-reason>{{ endReason }}</dd></div></template>
        <template v-if="row.retired_at"><div><dt>Retired</dt><dd data-agent-retired-at><TimeAgo :at="row.retired_at" /></dd></div></template>
        <template v-if="row.retiring_actor_name"><div><dt>Retired by</dt><dd data-agent-retired-by>{{ row.retiring_actor_name }}</dd></div></template>
    </dl>
</template>

<style scoped>
.lasting-facts { display: flex; flex-wrap: wrap; gap: 4px 16px; margin: 0; padding: 6px 14px; color: var(--text-2); font-size: 12px; }
.lasting-facts div { display: flex; gap: 5px; }
dt { color: var(--text-3); }
dt::after { content: ":"; }
dd { margin: 0; }
</style>
