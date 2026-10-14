<script setup>
import {ROLES, memberStatus, roleTitle} from "../domain/members.js";
import Btn from "../kit/Btn.vue";
import ListRow from "../kit/ListRow.vue";
import MemberEnvironments from "./MemberEnvironments.vue";
import Segmented from "../kit/Segmented.vue";

defineProps({member: {type: Object, required: true}, owner: Boolean, environments: {type: Array, default: () => []}});
const emit = defineEmits(["assign", "share", "end-logins", "remove"]);
</script>

<template>
    <ListRow :title="member.name" :text="memberStatus(member)">
        <template v-if="!member.departed" #end>
            <template v-if="owner">
                <span class="controls">
                    <Segmented :options="ROLES" :value="member.role" @pick="(role) => emit('assign', role)" />
                    <MemberEnvironments :shared="member.environments" :environments="environments" @share="(names) => emit('share', names)" />
                    <Btn small v-tip="'Log them out on every device; they can log in again'" @click="emit('end-logins')">Log out</Btn>
                    <Btn small v-tip="'They can no longer log in; what they wrote stays under their name'" @click="emit('remove')">Remove</Btn>
                </span>
            </template>
            <template v-else-if="member.role">
                <span class="role">{{ roleTitle(member.role) }}</span>
            </template>
        </template>
    </ListRow>
</template>

<style scoped>
.controls {
    display: flex;
    align-items: center;
    gap: 6px;
}

.role {
    font-size: 12px;
    color: var(--text-3);
}
</style>
