<script setup>
import {onMounted, ref} from "vue";
import {api} from "../api/client.js";
import TextDisplay from "../kit/TextDisplay.vue";

const about = ref(null);
const error = ref("");

onMounted(async () => {
    try {
        about.value = await api.changelog();
    } catch (failed) {
        error.value = failed.message;
    }
});
</script>

<template>
    <section class="about">
        <template v-if="error">
            <p class="error">{{ error }}</p>
        </template>
        <template v-if="about">
            <p class="version">Agent journal {{ about.version }}</p>
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

.error {
    color: var(--danger);
}
</style>
