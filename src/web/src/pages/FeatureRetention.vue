<script setup>
import {saveSettings} from "../actions/settings.js";
import {computed, ref} from "vue";
import {api} from "../api/client.js";
import {store} from "../state/store.js";
import TextInput from "../kit/TextInput.vue";

const KEPT = {report: 14, todo: 7};

const days = ref({});
const retention = computed(() => (store.settings && store.settings.keep) || {});

async function saveRetention(type) {
    await saveSettings({keep: {...retention.value, [type]: Number(days.value[type])}});
}
</script>

<template>
    <section class="block">
        <h3>Keep</h3>
        <p class="note">How long a finished row stays listed before it is archived; 0 keeps it</p>
        <template v-for="(kept, type) in KEPT" :key="type">
            <div class="row">
                <span class="title">{{ type }}s</span>
                <span class="amount">
                    <TextInput
                        :value="days[type]"
                        class="field"
                        type="number"
                        min="0"
                        :placeholder="String(retention[type] ?? kept)"
                        @input="days[type] = $event.target.value"
                        @change="saveRetention(type)"
                    />
                    days
                </span>
            </div>
        </template>
    </section>
</template>
