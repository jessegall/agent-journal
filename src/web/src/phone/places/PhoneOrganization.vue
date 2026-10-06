<script setup>
import {computed, onMounted, ref} from "vue";
import {api} from "../../api/client.js";
import Cell from "../kit/Cell.vue";
import CellGroup from "../kit/CellGroup.vue";
import EmptyList from "../kit/EmptyList.vue";
import PlaceScreen from "../kit/PlaceScreen.vue";
import {toast} from "../kit/toast.js";
import {askAgent} from "./askAgent.js";

const DRAFT =
    "Draft an agent organization for this project: its domains and the roles under each, as agentic-organization/domains/<domain>/domain.toml and roles/<role>/role.toml. Look at the code to see what the project needs, and ask me what is unclear.";
const ANOTHER =
    "Draft one more domain for this project's agent organization, with the roles under it, as agentic-organization/domains/<domain>/domain.toml and roles/<role>/role.toml. Look at the code to see what is not covered yet, and ask me what is unclear.";
const CARDINALITY = {worktree: "One per ticket", plural: "Any number at once", plan: "One for a whole plan"};

const props = defineProps({target: {type: String, default: ""}, back: {type: String, default: ""}});
const emit = defineEmits(["back", "open"]);
const domains = ref(null);
const failed = ref("");
const asked = ref(false);
const domain = computed(() => (props.target && domains.value ? domains.value.find((one) => one.name === props.target) || null : null));
const title = computed(() => (domain.value ? domain.value.title || domain.value.name : "Organization"));

onMounted(async () => {
    try {
        domains.value = (await api.organization()).domains || [];
    } catch (error) {
        failed.value = error.message;
    }
});

async function draft(brief) {
    try {
        await askAgent(brief);
        asked.value = true;
        toast("Asked the agent to draft it");
    } catch (error) {
        toast(error.message);
    }
}

const facts = (role) =>
    [
        ["Does", role.responsible],
        ["Leaves to others", role.not_responsible],
        ["Needs", (role.inputs || []).join(", ")],
        ["Hands back", (role.outputs || []).join(", ")],
        ["Skills", (role.skills || []).join(", ")],
        ["Tools", (role.tools || []).join(", ")],
        ["How many at once", [CARDINALITY[role.cardinality] || role.cardinality, role.model].filter(Boolean).join(" · ")],
    ].filter(([, text]) => text);
const workingRef = (agent) => (agent.plan ? `plan:${agent.plan}` : `ticket:${agent.n}`);
</script>

<template>
    <PlaceScreen
        :title="title"
        :sub="domain ? domain.description : 'Domains, their roles and who fills them'"
        :back="back"
        @back="emit('back')"
    >
        <template v-if="failed">
            <EmptyList icon="warn" title="The organization did not load" :reason="failed" />
        </template>
        <template v-else-if="domains && !domains.length">
            <EmptyList
                icon="family"
                title="No organization yet"
                reason="It names the project's domains, like Backend or Design, and the roles under each that a ticket's agent hands work to."
                :action="asked ? '' : 'Ask the agent to draft one'"
                @act="draft(DRAFT)"
            />
            <template v-if="asked">
                <p class="org-note">Asked the agent to draft one. It shows here once the agent has written it.</p>
            </template>
        </template>
        <template v-else-if="domain">
            <CellGroup head="Working now">
                <template v-for="agent in domain.working" :key="`${agent.role}.${agent.n}.${agent.env}`">
                    <Cell
                        :label="agent.title"
                        :sub="`${agent.role_title} · ${agent.plan ? `For plan ${agent.plan}` : `Ticket ${agent.n}`} · ${agent.env || agent.worktree}`"
                        icon="agents"
                        @pick="emit('open', workingRef(agent))"
                    />
                </template>
                <template v-if="!domain.working.length">
                    <Cell label="No agent in this domain is working right now" still />
                </template>
            </CellGroup>
            <template v-for="role in domain.roles" :key="role.name">
                <CellGroup :head="role.title || role.name" :line="role.name === domain.lead ? 'Leads the domain' : ''">
                    <template v-if="role.description">
                        <Cell :label="role.description" still />
                    </template>
                    <template v-for="[label, text] in facts(role)" :key="label">
                        <Cell :label="text" :sub="label" still />
                    </template>
                </CellGroup>
            </template>
        </template>
        <template v-else-if="domains">
            <CellGroup head="Domains">
                <template v-for="one in domains" :key="one.name">
                    <Cell
                        :label="one.title || one.name"
                        :sub="one.description"
                        icon="family"
                        :count="one.working.length || ''"
                        @pick="emit('open', `organization:${one.name}`)"
                    />
                </template>
            </CellGroup>
            <template v-if="asked">
                <p class="org-note">Asked the agent to draft a domain. It shows here once the agent has written it.</p>
            </template>
        </template>
        <template v-if="domains && domains.length && !domain" #foot>
            <button type="button" class="org-draft" :disabled="asked" @click="draft(ANOTHER)">Ask the agent to draft a domain</button>
        </template>
    </PlaceScreen>
</template>

<style scoped>
.org-note {
    margin: 12px 4px 0;
    color: var(--text-3);
    font-size: 0.8125rem;
}

.org-draft {
    width: 100%;
    min-height: 44px;
    border: 0;
    border-radius: 12px;
    background: var(--sel);
    color: var(--accent-text);
    font: inherit;
    font-weight: 600;
}

.org-draft:disabled {
    opacity: 0.5;
}
</style>
