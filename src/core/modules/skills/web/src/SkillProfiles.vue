<script setup>
import {profilesOffering, profilesRequiring} from "./skillWords.js";

// the profiles of agents that are given this skill, and which of them must read it at the start
const props = defineProps({folder: {type: String, required: true}, profiles: {type: Array, required: true}});
const offering = () => profilesOffering(props.profiles, props.folder);
const requires = (profile) => profilesRequiring(props.profiles, props.folder).includes(profile);
</script>

<template>
    <div class="profiles" data-skill-profiles>
        <template v-if="!offering().length"><p class="none" data-skill-profiles-none>No profile names this skill. A profile without a list of skills gets the skills of its agent type.</p></template>
        <template v-for="profile in offering()" :key="profile.name">
            <p class="profile" data-skill-profile><span class="name">{{ profile.name }}</span><template v-if="requires(profile)"><span class="badge-quiet">Must read it</span></template></p>
        </template>
    </div>
</template>

<style scoped>
.profiles { padding-top: 12px; }
.profile { display: flex; align-items: center; gap: var(--s3); margin: 0; padding: 8px 0; border-bottom: 1px solid var(--border-inner); font-size: 12.5px; }
.name { flex: 1; }
.none { margin: 0; color: var(--text-3); font-size: 12.5px; }
</style>
