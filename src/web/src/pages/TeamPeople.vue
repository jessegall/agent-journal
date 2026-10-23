<script setup>
import {onMounted, ref} from "vue";
import {api} from "../api/client.js";
import {agentRunningIn} from "../composables/settings.js";
import {clock} from "../format/time.js";
import Btn from "../kit/Btn.vue";
import Icon from "../kit/Icon.vue";
import ListBox from "../kit/ListBox.vue";
import StateDot from "../kit/StateDot.vue";
import {href} from "../route.js";
import {choose} from "../state/environment.js";
import TeamFailure from "./TeamFailure.vue";
import "./team.css";

const LEAD = "A colleague's environment opens read-only: what you write there is a comment, and their agent treats it as a colleague's words.";
const ROLES = {admin: "Admin", member: "Member", relay: "Hosted journal"};
const people = ref([]);
const failure = ref("");
const initial = (name) => (name || "?").trim().charAt(0).toUpperCase();
const presence = (person) => (person.online ? "Online" : person.seen_at ? `Offline since ${clock(person.seen_at)}` : "Not seen yet");

onMounted(async () => {
    try {
        people.value = (await api.teamPeople()).people;
    } catch (e) {
        failure.value = e.message;
    }
});
</script>

<template>
    <ListBox title="People" :count="people.length" :lead="LEAD">
        <template v-if="failure">
            <TeamFailure :text="failure" />
        </template>
        <template v-for="person in people" :key="person.id">
            <div class="team-person">
                <div class="team-person-head">
                    <span class="team-initial">{{ initial(person.name) }}</span>
                    <div class="team-person-name">
                        <span class="team-name">
                            {{ person.name }}
                            <template v-if="person.me">
                                <span class="team-you">You</span>
                            </template>
                        </span>
                        <span class="team-role">{{ ROLES[person.role] || person.role }}</span>
                    </div>
                    <template v-if="!person.me">
                        <span class="team-presence">
                            <StateDot :state="person.online ? 'done' : ''" />
                            {{ presence(person) }}
                        </span>
                    </template>
                </div>
                <div class="team-environments">
                    <template v-if="!person.environments.length">
                        <p class="team-fine">No environments yet</p>
                    </template>
                    <template v-for="environment in person.environments" :key="environment.id">
                        <div class="team-environment">
                            <StateDot :state="person.me && agentRunningIn(environment.name) ? 'running' : ''" />
                            <span class="team-environment-name">{{ environment.name }}</span>
                            <template v-if="person.me">
                                <span class="team-environment-word">{{ agentRunningIn(environment.name) ? "Agent working" : "No agent running" }}</span>
                                <span class="team-fine">In the sidebar</span>
                            </template>
                            <template v-else>
                                <span class="team-environment-word" />
                                <Btn small :href="href.page()" @click="choose(environment.name)">Open <Icon name="chevronRight" /></Btn>
                            </template>
                        </div>
                    </template>
                </div>
            </div>
        </template>
    </ListBox>
</template>

<style scoped>
.team-person {
    display: flex;
    flex-direction: column;
    gap: 8px;
    padding: 12px 16px;
}

.team-person + .team-person {
    border-top: 1px solid var(--border);
}

.team-person-head {
    display: flex;
    align-items: center;
    gap: 10px;
}

.team-initial {
    display: inline-flex;
    flex: none;
    align-items: center;
    justify-content: center;
    width: 26px;
    height: 26px;
    border: 1px solid var(--border-2);
    border-radius: 50%;
    font-size: 11.5px;
    font-weight: 600;
}

.team-person-name {
    display: flex;
    flex: 1 1 auto;
    flex-direction: column;
    min-width: 0;
}

.team-name {
    display: flex;
    align-items: center;
    gap: 6px;
    font-weight: 500;
}

.team-you {
    padding: 0 6px;
    border: 1px solid var(--border-2);
    border-radius: 5px;
    color: var(--text-3);
    font-size: 11px;
    font-weight: 400;
}

.team-role {
    color: var(--text-3);
    font-size: 12px;
}

.team-presence {
    display: flex;
    flex: none;
    align-items: center;
    gap: 6px;
    color: var(--text-3);
    font-size: 12px;
}

.team-environments {
    display: flex;
    flex-direction: column;
    margin-left: 36px;
    border-left: 1px solid var(--border);
}

.team-environment,
.team-environments > .team-fine {
    display: flex;
    align-items: center;
    gap: 9px;
    min-height: 30px;
    padding-left: 12px;
}

.team-environment-name {
    font-family: var(--mono);
    font-size: 12px;
}

.team-environment-word {
    flex: 1 1 auto;
    min-width: 0;
    overflow: hidden;
    color: var(--text-3);
    font-size: 12px;
    text-overflow: ellipsis;
    white-space: nowrap;
}

@media (max-width: 600px) {
    .team-environments {
        margin-left: 0;
    }
}
</style>
