<script setup>
import {ref} from "vue";
import ExecutionClasses from "./ExecutionClasses.vue";

// the queue's Settings: the limits suites declare for the queue, then each lane's limit and the execution classes
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
    <div data-queue-settings>
        <template v-for="limit in queue.suite_limits" :key="limit.key">
            <div class="control"><div><label :for="limit.key">{{ limit.title }}</label><p>{{ limit.description }}</p></div>
                <input :id="limit.key" class="limit" type="number" min="0" :value="limit.value" :disabled="saving" data-queue-suite-limit @change="save(limit.key, $event.target.value)" />
            </div>
        </template>
        <template v-if="failure"><p class="failure" role="alert">{{ failure }}</p></template>
        <ExecutionClasses :read="read" />
    </div>
</template>
<style scoped>
.control { display:flex; align-items:center; gap:12px; padding:10px 14px; border-bottom:1px solid var(--border); }
.control > div:first-child { flex:1; }
label { font-size:12.5px; font-weight:500; }
.control p { margin:3px 0 0; color:var(--text-3); font-size:11.5px; line-height:1.4; }
.limit { flex:none; width:72px; height:28px; padding:0 8px; border:1px solid var(--border-2); border-radius:6px; background:none; color:var(--text); font:inherit; }
.failure { margin:0; padding:9px 14px; border-bottom:1px solid var(--border); color:var(--danger); font-size:12px; }
</style>
