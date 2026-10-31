<script setup>
import {computed, onMounted, ref} from "vue";
import {api} from "../api/client.js";
import {saveSettings} from "../actions/settings.js";
import {FIXED_ROLES, RANKING, allowedFor, parseAllowed, toggled} from "../domain/allowedModels.js";
import {PROVIDER_TITLES} from "../domain/models.js";
import Chip from "../kit/Chip.vue";
import {store} from "../state/store.js";

const profiles = ref([]);
onMounted(async () => {
    try {
        profiles.value = (await api.agentProfiles()).profiles.filter((profile) => profile.profile_type === "worker").map((profile) => profile.name);
    } catch {
        profiles.value = [];
    }
});

const spec = computed(() => (store.spec?.features || []).flatMap((feature) => feature.settings || []).find((setting) => setting.name === "allowed_models"));
const parsed = computed(() => parseAllowed(store.settings?.workers?.allowed_models ?? spec.value?.default ?? []));
const roles = computed(() => [...profiles.value, ...FIXED_ROLES]);
const providers = Object.keys(RANKING);

function pick(provider, role, model) {
    const lines = toggled(parsed.value, provider, role, model);
    if (lines) saveSettings({workers: {allowed_models: lines}});
}
</script>

<template>
    <div class="models">
        <template v-for="provider in providers" :key="provider">
            <h4 class="models-provider">{{ PROVIDER_TITLES[provider] }}</h4>
            <template v-for="role in roles" :key="`${provider}-${role}`">
                <div class="models-row" :data-role="`${provider} ${role}`">
                    <span class="models-role">{{ role }}</span>
                    <span class="models-choices">
                        <template v-for="model in RANKING[provider]" :key="model">
                            <button type="button" class="models-pick" :aria-pressed="allowedFor(parsed, provider, role).includes(model)" @click="pick(provider, role, model)">
                                <Chip :class="{on: allowedFor(parsed, provider, role).includes(model)}">{{ model }}</Chip>
                            </button>
                        </template>
                    </span>
                </div>
            </template>
        </template>
        <p class="models-note">The models are listed from the cheapest to the strongest. A role may run on any model ticked; a worker asking for another model gets the nearest one ticked.</p>
    </div>
</template>

<style scoped>
.models {
    display: flex;
    flex-direction: column;
    gap: 6px;
}

.models-provider {
    margin: 10px 0 2px;
    color: var(--text-2);
    font-size: 12px;
    font-weight: 600;
}

.models-row {
    display: flex;
    align-items: center;
    gap: 14px;
    min-height: 32px;
    padding: 4px 12px;
    border-bottom: 1px solid var(--border);
}

.models-role {
    flex: 0 0 150px;
    color: var(--text);
    font-size: 13px;
}

.models-choices {
    display: flex;
    flex-wrap: wrap;
    gap: 6px;
}

.models-pick {
    padding: 0;
    border: 0;
    background: none;
    cursor: pointer;
}

.models-pick :deep(.chip) {
    opacity: 0.5;
}

.models-pick :deep(.chip.on) {
    opacity: 1;
    border-color: var(--accent);
    color: var(--text);
}

.models-note {
    margin: 6px 0 0;
    color: var(--text-3);
    font-size: 12px;
}
</style>
