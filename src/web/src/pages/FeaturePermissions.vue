<script setup>
import {computed, ref} from "vue";
import {api} from "../api/client.js";
import Switch from "../kit/Switch.vue";
import {store} from "../state/store.js";

const permissions = computed(() => (store.settings && store.settings.permission_prompts) || {});
const relaunching = ref(false);

async function skipPrompts(skip) {
    relaunching.value = true;
    try {
        await api.relaunchAgent(permissions.value.session, skip);
        store.settings = await api.settings();
    } finally {
        relaunching.value = false;
    }
}
</script>

<template>
    <template v-if="permissions.possible">
        <section class="block">
            <div class="row">
                <span class="text">
                    <span class="title">Skip permission prompts</span>
                    <span class="note">
                        The agent is running {{ permissions.running ? "without" : "with" }} permission prompts. Changing this restarts the
                        agent in the same conversation.
                    </span>
                </span>
                <template v-if="relaunching">
                    <span class="note">Restarting</span>
                </template>
                <template v-else>
                    <Switch :on="!!permissions.skip" @change="skipPrompts" />
                </template>
            </div>
        </section>
    </template>
</template>
