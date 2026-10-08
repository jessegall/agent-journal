<script setup>
import {computed} from "vue";
import EmptyState from "../kit/EmptyState.vue";
import {integrationsIn} from "../domain/integrations.js";
import {store} from "../state/store.js";
import IntegrationCard from "./IntegrationCard.vue";

const integrations = computed(() => integrationsIn(store.spec?.features));
</script>

<template>
    <section class="integrations">
        <div class="body">
            <p class="lead">
                An integration reads from an outside service you already use. Each stays off until you switch it on and pick the key it
                signs in with. The journal keeps the key; an agent never sees it.
            </p>
            <template v-if="!integrations.length">
                <EmptyState title="No integration yet">Integrations you can switch on show here.</EmptyState>
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
