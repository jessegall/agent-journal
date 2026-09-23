<script setup>
import {onMounted, ref} from "vue";
import {api} from "../api/client.js";
import {sendMessage} from "../chat/outbox.js";
import Btn from "../kit/Btn.vue";
import EmptyState from "../kit/EmptyState.vue";
import SectionHeading from "../kit/SectionHeading.vue";
import RoleCard from "../organization/RoleCard.vue";
import {route} from "../route.js";

const domains = ref(null);
const asked = ref(false);
const DRAFT =
    "Draft an agent organization for this project: its domains and the roles under each, as agentic-organization/domains/<domain>/domain.toml and roles/<role>/role.toml. Look at the code to see what the project needs, and ask me what is unclear.";

onMounted(async () => (domains.value = (await api.organization()).domains));

async function draft() {
    await sendMessage(route.value.env, {brief: DRAFT});
    asked.value = true;
}
</script>

<template>
    <section class="organization">
        <template v-if="domains && !domains.length">
            <EmptyState>
                There is no agent organization yet. It names the project's domains, like Backend or Design, and the roles under each that a
                ticket's agent hands work to.
            </EmptyState>
            <template v-if="asked">
                <p class="asked">Asked the agent to draft one. It will appear here once the agent has written it.</p>
            </template>
            <template v-else>
                <Btn kind="primary" small class="draft" @click="draft">Ask the agent to draft one</Btn>
            </template>
        </template>
        <template v-for="domain in domains || []" :key="domain.name">
            <section class="domain">
                <SectionHeading>{{ domain.title || domain.name }}</SectionHeading>
                <template v-if="domain.description">
                    <p class="description">{{ domain.description }}</p>
                </template>
                <div class="roles">
                    <template v-for="role in domain.roles" :key="role.name">
                        <RoleCard :role="role" :lead="role.name === domain.lead" />
                    </template>
                </div>
            </section>
        </template>
    </section>
</template>

<style scoped>
.organization {
    display: flex;
    flex-direction: column;
    gap: 24px;
    padding: 16px 20px;
}

.domain {
    display: flex;
    flex-direction: column;
    gap: 10px;
}

.description,
.asked {
    margin: 0;
    color: var(--text-2);
    font-size: 13px;
    line-height: 1.5;
}

.roles {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
    gap: 12px;
}

.draft {
    align-self: flex-start;
}
</style>
