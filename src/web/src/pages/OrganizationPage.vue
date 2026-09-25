<script setup>
import {computed, ref} from "vue";
import {sendMessage} from "../chat/outbox.js";
import Btn from "../kit/Btn.vue";
import EmptyState from "../kit/EmptyState.vue";
import ListRow from "../kit/ListRow.vue";
import SectionHeading from "../kit/SectionHeading.vue";
import RoleCard from "../organization/RoleCard.vue";
import {peek, route} from "../route.js";
import {store} from "../state/store.js";
import {polled} from "../sync/polled.js";
import {usePoll} from "../poll.js";

usePoll(...polled.organization);
const domains = computed(() => store.organization && store.organization.domains);
const opened = computed(() => (typeof route.value.n === "string" ? route.value.n : ""));
const shown = computed(() => (domains.value || []).filter((domain) => !opened.value || domain.name === opened.value));
const asked = ref(false);
const DRAFT =
    "Draft an agent organization for this project: its domains and the roles under each, as agentic-organization/domains/<domain>/domain.toml and roles/<role>/role.toml. Look at the code to see what the project needs, and ask me what is unclear.";

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
        <template v-if="opened">
            <a class="back" :href="`#/${route.env}/organization`">All domains</a>
        </template>
        <template v-for="domain in shown" :key="domain.name">
            <section class="domain">
                <SectionHeading>{{ domain.title || domain.name }}</SectionHeading>
                <template v-if="domain.description">
                    <p class="description">{{ domain.description }}</p>
                </template>
                <template v-if="opened">
                    <div class="working">
                        <h3 class="working-title">Working now</h3>
                        <template v-if="!domain.working.length">
                            <p class="description">No agent in this domain is working right now.</p>
                        </template>
                        <template v-for="agent in domain.working" :key="`${agent.role}.${agent.n}.${agent.env}`">
                            <button type="button" class="working-row" @click="agent.plan ? peek('plan', agent.plan) : peek('ticket', agent.n)">
                                <ListRow
                                    :kind="agent.role_title"
                                    :title="agent.plan ? `For plan ${agent.plan}` : `Ticket ${agent.n}`"
                                    :text="agent.env || agent.worktree"
                                >
                                    {{ agent.title }}
                                </ListRow>
                            </button>
                        </template>
                    </div>
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

.back {
    align-self: flex-start;
    color: var(--text-2);
    font-size: 12px;
    text-decoration: none;
}

.back:hover {
    color: var(--text);
}

.working {
    display: flex;
    flex-direction: column;
    gap: 6px;
}

.working-title {
    margin: 4px 0 0;
    color: var(--text-2);
    font-size: 12px;
    font-weight: 500;
}

.working-row {
    padding: 0;
    border: 0;
    background: none;
    color: inherit;
    font: inherit;
    text-align: left;
    cursor: pointer;
}
</style>
