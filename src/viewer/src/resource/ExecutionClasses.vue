<script setup>
import {onMounted, ref} from "vue";
import ProcessQueueBand from "./ProcessQueueBand.vue";
import ExecutionClassRow from "./ExecutionClassRow.vue";
import ExecutionClassForm from "./ExecutionClassForm.vue";
import {CLASS_PRESETS} from "./executionClasses.js";

const props = defineProps({read: {type: Function, required: true}});
const table = ref(null);
const failure = ref("");
const saving = ref(false);
async function load() {
    const answer = await props.read(["queue-class", "list"]);
    if (answer.ok) table.value = answer.value;
    else failure.value = answer.error;
}
// every change is one journal line; a refusal shows its text and the table is read again after a change
async function send(line, done = () => {}) {
    if (saving.value) return;
    saving.value = true;
    const answer = await props.read(line);
    failure.value = answer.ok ? "" : answer.error;
    saving.value = false;
    if (!answer.ok) return;
    done();
    await load();
}
onMounted(load);
</script>

<template>
    <section data-execution-classes>
        <ProcessQueueBand icon="gauge">Execution classes</ProcessQueueBand>
        <p class="lead">Each run the journal starts belongs to a class, which says its lane, how many slot units it takes and its priority.</p>
        <template v-if="table">
            <template v-for="setting in table.settings" :key="setting.key">
                <div class="control"><div><label :for="setting.key">{{ setting.title }}</label><p>{{ setting.description }}</p></div>
                    <input :id="setting.key" class="number" type="number" min="1" :value="setting.value" :disabled="saving" :data-lane-setting="setting.key" @change="send(['setting', 'set', setting.key, $event.target.value])" />
                </div>
            </template>
            <div class="control presets"><div><label>Size for this machine</label><p>Sets every lane's capacity from the number of processor cores.</p></div>
                <template v-for="preset in CLASS_PRESETS" :key="preset.name"><button type="button" :disabled="saving" :data-class-preset="preset.name" @click="send(['queue-class', 'preset', preset.name])">{{ preset.title }}</button></template>
            </div>
            <div class="scroll"><table data-class-table>
                <thead><tr><th scope="col">Class</th><th scope="col">Lane</th><th scope="col">Slot units</th><th scope="col">Priority</th><th scope="col">At once</th><th scope="col"><span class="hidden">Actions</span></th></tr></thead>
                <tbody><template v-for="entry in table.classes" :key="entry.name"><ExecutionClassRow :entry="entry" :saving="saving" @send="send" /></template></tbody>
            </table></div>
            <ExecutionClassForm :read="read" :saving="saving" @send="send" />
        </template>
        <template v-if="failure"><p class="failure" role="alert" data-class-failure>{{ failure }}</p></template>
    </section>
</template>

<style scoped>
.lead { margin:0; padding:10px 14px; color:var(--text-3); font-size:12px; line-height:1.5; }
.control { display:flex; align-items:center; gap:12px; padding:10px 14px; border-top:1px solid var(--border); }
.control > div:first-child { flex:1; }
label { font-size:12.5px; font-weight:500; }
.control p { margin:3px 0 0; color:var(--text-3); font-size:11.5px; line-height:1.4; }
.number { flex:none; width:72px; height:28px; padding:0 8px; border:1px solid var(--border-2); border-radius:6px; background:none; color:var(--text); font:inherit; }
.presets button { flex:none; padding:4px 10px; border:1px solid var(--border-2); border-radius:6px; background:none; color:var(--text-2); font:inherit; font-size:12px; cursor:pointer; }
.presets button:hover { color:var(--text); }
button:disabled { opacity:.4; cursor:default; }
.scroll { overflow-x:auto; border-top:1px solid var(--border); }
table { width:100%; border-collapse:collapse; }
thead th { padding:6px 8px; color:var(--text-3); font-size:11px; font-weight:500; text-align:left; }
.hidden { position:absolute; width:1px; height:1px; overflow:hidden; clip:rect(0 0 0 0); }
.failure { margin:0; padding:9px 14px; border-top:1px solid var(--border); color:var(--danger); font-size:12px; }
</style>
