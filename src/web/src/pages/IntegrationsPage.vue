<script setup>
import {computed} from "vue";
import {integrationsIn} from "../domain/integrations.js";
import {route} from "../route.js";
import {store} from "../state/store.js";
import IntegrationCard from "./IntegrationCard.vue";
import IntegrationSettings from "./IntegrationSettings.vue";

const integrations = computed(() => integrationsIn(store.spec?.features));
const opened = computed(() => integrations.value.find((feature) => feature.name === route.value.sub));
</script>

<template>
    <section class="integrations">
        <template v-if="opened">
            <IntegrationSettings :feature="opened" />
        </template>
        <template v-else>
            <div class="body">
                <p class="lead">Outside services the journal can reach for you.</p>
                <div class="cards">
                    <template v-for="feature in integrations" :key="feature.name">
                        <IntegrationCard :feature="feature" />
                    </template>
                </div>
            </div>
        </template>
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
