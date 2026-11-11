<script setup>
import {computed} from "vue";
import {TimeAgo} from "@journal/window-kit";

// why the session before the current one ended, for each reason word of the session history
const END_REASONS = {
    finished: "its work was finished", cache_passed: "its cache had passed", context_limit: "its context was full", replaced_by_person: "a person replaced it",
    driver_changed: "its driver was changed", each_launch: "each job starts a new one", launch_rotation: "its program was changed for the job",
    conversation_missing: "its conversation was gone", never_started: "it never started", unknown: "the reason is not known",
};
const props = defineProps({row: {type: Object, required: true}});
const endReason = computed(() => (props.row.replaced_session_end_reason ? END_REASONS[props.row.replaced_session_end_reason] || props.row.replaced_session_end_reason.replaceAll("_", " ") : ""));
</script>

<template>
    <dl class="lasting-facts" data-agent-lasting-facts>
        <template v-if="row.created_at"><div><dt>Started</dt><dd data-agent-first-dispatched><TimeAgo :at="row.created_at" /></dd></div></template>
        <div><dt>Sessions</dt><dd data-agent-session-count>{{ row.session_count ?? 0 }}</dd></div>
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
