<script setup>
import {ROLES, memberStatus, roleTitle} from "../domain/members.js";
import ListRow from "../kit/ListRow.vue";
import Segmented from "../kit/Segmented.vue";

defineProps({member: {type: Object, required: true}, owner: Boolean});
const emit = defineEmits(["assign"]);
</script>

<template>
    <ListRow :title="member.name" :text="memberStatus(member)">
        <template #end>
            <template v-if="owner">
                <Segmented :options="ROLES" :value="member.role" @pick="(role) => emit('assign', role)" />
            </template>
            <template v-else>
                <span class="role">{{ roleTitle(member.role) }}</span>
            </template>
        </template>
    </ListRow>
</template>

<style scoped>
.role {
    font-size: 12px;
    color: var(--text-3);
}
</style>
