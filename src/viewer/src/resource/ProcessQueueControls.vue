<script setup>
import {ref} from "vue";
import Icon from "../kit/Icon.vue";
import ProcessQueueBand from "./ProcessQueueBand.vue";
const props = defineProps({queue: {type: Object, required: true}, read: {type: Function, required: true}});
const emit = defineEmits(["saved"]);
const saving = ref(false);
const failure = ref("");
async function save(key, value) {
    if (saving.value) return;
    saving.value = true;
    const answer = await props.read(["setting", "set", key, String(value)]);
    failure.value = answer.ok ? "" : answer.error;
    if (answer.ok) emit("saved");
    saving.value = false;
}
</script>
<template>
    <div data-queue-controls>
        <ProcessQueueBand icon="gauge">Now</ProcessQueueBand>
        <div class="counts">
            <div><strong data-queue-spots>{{ queue.used_slots }} <span>of {{ queue.parallel_limit }}</span></strong>
                <p>Commands running. {{ queue.used_slots >= queue.parallel_limit ? 'Every place is taken.' : `${queue.parallel_limit - queue.used_slots} ${queue.parallel_limit - queue.used_slots === 1 ? 'place' : 'places'} free.` }}</p>
                <div class="spots" aria-label="Places in use"><template v-for="spot in queue.parallel_limit" :key="spot"><span :class="{used: spot <= queue.used_slots}" /></template></div>
            </div>
            <div><strong data-queue-waiting>{{ queue.waiting_count }}</strong><p>Commands waiting</p><template v-if="queue.waiting_count"><p>The oldest goes first.</p></template></div>
        </div>
        <div class="control"><div><label id="queue-limit-label">Commands at once</label><p>How many of the workers' commands may run at the same time. The rest wait. Lowering it stops none that are running.</p></div>
            <div class="stepper"><button type="button" aria-label="One fewer command at once" :disabled="saving || queue.parallel_limit <= 1" @click="save(queue.limit_setting, queue.parallel_limit - 1)">−</button><output aria-labelledby="queue-limit-label" data-queue-limit>{{ queue.parallel_limit }}</output><button type="button" aria-label="One more command at once" :disabled="saving" @click="save(queue.limit_setting, queue.parallel_limit + 1)">+</button></div>
        </div>
        <template v-for="limit in queue.suite_limits" :key="limit.key">
            <div class="control"><div><label :for="limit.key">{{ limit.title }}</label><p>{{ limit.description }}</p></div>
                <input :id="limit.key" class="limit" type="number" min="0" :value="limit.value" :disabled="saving" data-queue-suite-limit @change="save(limit.key, $event.target.value)" />
            </div>
        </template>
        <div class="control"><div><label id="main-spots-label">Count the main agent</label><p>Its commands always start right away, but each one takes a place, so fewer workers run at once.</p></div>
            <button type="button" role="switch" aria-labelledby="main-spots-label" :aria-checked="queue.count_main_runs" :disabled="saving" data-queue-main-spots @click="save(queue.main_spots_setting, queue.count_main_runs ? 'off' : 'on')"><span /></button>
        </div>
        <template v-if="queue.halt_cause === 'update'"><p class="note halted" role="status" data-queue-update-waits><Icon name="pause" :size="13" />An update waits for the running commands to end. Every command that waits stays in the queue, in order, and gets its place once the update is done.</p></template>
        <template v-else-if="queue.halted"><p class="note halted" role="status" data-queue-held><Icon name="pause" :size="13" />The queue is paused. No waiting command gets a place until it is resumed. {{ queue.halt_reason }}</p></template>
        <template v-if="failure"><p class="note failure" role="alert">{{ failure }}</p></template>
    </div>
</template>
<style scoped>
.counts { display:grid; grid-template-columns:1.3fr 1fr; }
.counts > div { padding:12px 14px; min-width:0; }
.counts > div + div { border-left:1px solid var(--border); }
strong { font-size:22px; line-height:1.1; font-weight:600; font-variant-numeric:tabular-nums; }
strong span { color:var(--text-3); font-size:13px; font-weight:400; }
p { margin:3px 0 0; color:var(--text-3); font-size:12px; }
.spots { display:flex; flex-wrap:wrap; gap:5px; margin-top:10px; }
.spots span { box-sizing:border-box; width:14px; height:14px; border:1.5px solid var(--border-3); border-radius:4px; }
.spots .used { background:var(--accent); border-color:var(--accent); }
.control { display:flex; align-items:center; gap:12px; padding:10px 14px; border-top:1px solid var(--border); }
.control > div:first-child { flex:1; }
label { font-size:12.5px; font-weight:500; }
.control p { font-size:11.5px; line-height:1.4; }
.stepper { display:flex; flex:none; height:28px; overflow:hidden; border:1px solid var(--border-2); border-radius:7px; }
.limit { flex:none; width:72px; height:28px; padding:0 8px; border:1px solid var(--border-2); border-radius:6px; background:none; color:var(--text); font:inherit; }
.stepper button { width:30px; border:0; background:none; color:var(--text-2); font-size:15px; cursor:pointer; }
.stepper button:hover { background:var(--hover); color:var(--text); }
.stepper output { display:grid; place-items:center; min-width:36px; border-inline:1px solid var(--border); font-size:13px; font-weight:600; font-variant-numeric:tabular-nums; }
[role="switch"] { flex:none; width:30px; height:18px; padding:3px; border:0; border-radius:9px; background:var(--border-3); cursor:pointer; }
[role="switch"] span { display:block; width:12px; height:12px; border-radius:50%; background:var(--text-3); transition:transform .16s; }
[role="switch"][aria-checked="true"] { background:var(--accent); }
[role="switch"][aria-checked="true"] span { transform:translateX(12px); background:white; }
button:disabled { opacity:.4; cursor:default; }
.note { display:flex; gap:8px; margin:0; padding:9px 14px; border-top:1px solid var(--border); font-size:12px; line-height:1.5; }
.note svg { flex:none; }
.halted { color:var(--tone-warn); } .failure { color:var(--danger); }
</style>
