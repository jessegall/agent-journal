<script setup>
import {onMounted} from "vue";
import {useUpdates} from "../composables/updates.js";
import Btn from "../kit/Btn.vue";
import StateDot from "../kit/StateDot.vue";
import TextDisplay from "../kit/TextDisplay.vue";

const {about, error, status, update, start} = useUpdates();

onMounted(start);
</script>

<template>
    <section class="about">
        <template v-if="error">
            <p class="error">{{ error }}</p>
        </template>
        <template v-if="about">
            <p class="version">Agent journal {{ about.version }}</p>
            <template v-if="status">
                <div class="update-line">
                    <template v-if="status.busy">
                        <StateDot state="running" />
                    </template>
                    <span>{{ status.text }}</span>
                    <template v-if="status.update">
                        <Btn kind="primary" @click="update">Update to {{ about.latest }}</Btn>
                    </template>
                </div>
            </template>
            <TextDisplay class="changelog" :text="about.changelog" />
        </template>
    </section>
</template>

<style scoped>
.about {
    padding: 16px 20px;
    max-width: 760px;
    display: flex;
    flex-direction: column;
    gap: 12px;
}

.version {
    font-weight: 600;
}

.update-line {
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    gap: 10px;
    padding: 10px 12px;
    border: 1px solid var(--border);
    border-radius: 8px;
    color: var(--text-2);
    font-size: 13px;
}

.update-line .btn {
    margin-left: auto;
}

.error {
    color: var(--danger);
}
</style>
