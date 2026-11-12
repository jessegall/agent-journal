<script setup>
import {TimeAgo} from "@journal/window-kit";

// what a retired agent keeps to say about its end: when it was retired and by whom; the others have nothing to add under their bar
defineProps({row: {type: Object, required: true}});
</script>

<template>
    <dl v-if="row.retired_at" class="lasting-facts" data-agent-lasting-facts>
        <div><dt>Retired</dt><dd data-agent-retired-at><TimeAgo :at="row.retired_at" /></dd></div>
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
