<script setup>
import {computed} from "vue";
import EmptyState from "../kit/EmptyState.vue";
import {integrationsIn, isOn} from "../domain/integrations.js";
import {store} from "../state/store.js";
import IntegrationCard from "./IntegrationCard.vue";

const integrations = computed(() => integrationsIn(store.spec?.features));
const anyOn = computed(() => integrations.value.some((feature) => isOn(store.settings, feature.name)));
</script>

<template>
    <section class="integrations">
        <div class="body">
            <p class="lead">Outside services the journal can reach for you.</p>
            <template v-if="!anyOn">
                <EmptyState title="No integration is switched on">Turn one on below, then choose its key.</EmptyState>
            </template>
            <div class="cards">
                <template v-for="feature in integrations" :key="feature.name">
                    <IntegrationCard :feature="feature" />
                </template>
            </div>
        </div>
    </section>
</template>

<style scoped>
.integrations {
    height: 100%;
    overflow: auto;
}

.body {
    display: flex;
    flex-direction: column;
    gap: 16px;
    max-width: 1100px;
    margin: 0 auto;
    padding: 18px 20px;
}

.lead {
    margin: 0;
    color: var(--text-2);
}

.cards {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(340px, 1fr));
    gap: 16px;
}

@media (max-width: 640px) {
    .cards {
        grid-template-columns: 1fr;
    }
}
</style>
