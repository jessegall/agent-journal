<script setup>
import {computed, ref} from "vue";
import Icon from "../kit/Icon.vue";
import MenuPanel from "../kit/MenuPanel.vue";
import Spinner from "../kit/Spinner.vue";
import BoardRoleChip from "./BoardRoleChip.vue";
import BoardRolesPanel from "./BoardRolesPanel.vue";
import {useFitCount} from "../composables/fitCount.js";
import {route} from "../route.js";

const SMALL = 6;
const props = defineProps({roles: {type: Array, required: true}});
const at = (role) => role.tickets.map((ticket) => ({key: `${role.name}-${ticket.n}`, title: role.title, n: ticket.n, task: ticket.title, env: ticket.env}));
const idle = (role) => [{key: role.name, title: role.title, n: 0, task: "", env: ""}];
const small = computed(() => props.roles.length <= SMALL);
const working = computed(() => props.roles.flatMap(at));
const chips = computed(() => (small.value ? props.roles.flatMap((role) => (role.tickets.length ? at(role) : idle(role))) : working.value));
const domains = computed(() => {
    const grouped = [];
    for (const role of props.roles) {
        if (grouped.at(-1)?.name !== role.domain) grouped.push({name: role.domain, title: role.domain_title, roles: []});
        const cards = role.tickets.map((ticket) => `#${ticket.n}`).join(", ");
        grouped.at(-1).roles.push({name: role.name, title: role.title, busy: !!cards, cards: cards || "idle"});
    }
    return grouped.map((domain) => ({...domain, working: domain.roles.filter((role) => role.busy).length}));
});
const organization = computed(() => `#/${route.value.env}/organization/${props.roles[0].domain}`);
const cards = computed(() => [...new Set(working.value.map((chip) => `#${chip.n}`))].join(", "));
const box = ref(null);
const fits = useFitCount(box, chips);
const hidden = computed(() => Math.max(0, chips.value.length - fits.value));
const anchor = ref(null);
const show = (e) => {
    anchor.value = anchor.value === e.currentTarget ? null : e.currentTarget;
};
</script>

<template>
    <section class="board-roles" aria-label="Roles at work">
        <span class="board-roles-label">Roles</span>
        <template v-if="!chips.length">
            <span class="board-roles-quiet">No role is working right now</span>
        </template>
        <div ref="box" class="board-roles-chips">
            <template v-for="(chip, i) in chips" :key="chip.key">
                <BoardRoleChip :title="chip.title" :n="chip.n" :task="chip.task" :env="chip.env" :class="{out: i >= fits}" />
            </template>
        </div>
        <template v-if="hidden">
            <button type="button" class="board-roles-button board-roles-more" @click.stop="show">+{{ hidden }} more working</button>
        </template>
        <template v-if="working.length">
            <button type="button" class="board-roles-button board-roles-summary" @click.stop="show">
                <Spinner />
                {{ working.length }} working on {{ cards }}
            </button>
        </template>
        <template v-if="small">
            <a class="board-roles-button" :href="organization">Organization</a>
        </template>
        <template v-else>
            <button type="button" :class="['board-roles-button', 'board-roles-all', {open: anchor}]" :aria-expanded="!!anchor" @click.stop="show">
                All {{ roles.length }} roles
                <Icon name="caret" :size="12" :class="{flip: anchor}" />
            </button>
        </template>
        <template v-if="anchor">
            <MenuPanel :anchor="anchor" align="end" :min-width="320" :max-width="420" :max-height="520" @click.stop @close="anchor = null">
                <BoardRolesPanel :working="working" :domains="domains" :organization="organization" />
            </MenuPanel>
        </template>
    </section>
</template>

<style scoped>
.board-roles {
    display: flex;
    flex: none;
    align-items: center;
    gap: 10px;
    height: 38px;
    padding: 0 12px 0 20px;
    border-bottom: 1px solid var(--border);
    font-size: 12.5px;
}

.board-roles-label {
    flex: none;
    color: var(--text-3);
    font-size: 12px;
    font-weight: 500;
}

.board-roles-chips {
    display: flex;
    flex: 1;
    align-items: center;
    gap: 6px;
    min-width: 0;
    overflow: hidden;
}

.out {
    visibility: hidden;
}

.board-roles-quiet {
    color: var(--text-3);
    font-size: 12px;
    white-space: nowrap;
}

.board-roles-button {
    display: inline-flex;
    flex: none;
    align-items: center;
    gap: 6px;
    height: 26px;
    padding: 0 10px;
    border: 1px solid var(--border-2);
    border-radius: 7px;
    background: none;
    color: var(--text-2);
    font: inherit;
    font-size: 12px;
    white-space: nowrap;
    text-decoration: none;
    cursor: pointer;
}

.board-roles-button:hover,
.board-roles-button.open {
    border-color: var(--border-3);
    background: var(--hover);
    color: var(--text);
}

.board-roles-summary {
    display: none;
}

.flip {
    transform: rotate(180deg);
}

@media (max-width: 640px) {
    .board-roles-chips,
    .board-roles-more {
        display: none;
    }

    .board-roles-summary {
        display: inline-flex;
        flex: 1;
        min-width: 0;
        overflow: hidden;
        text-overflow: ellipsis;
    }

    .board-roles-summary ~ .board-roles-all {
        display: none;
    }
}
</style>
