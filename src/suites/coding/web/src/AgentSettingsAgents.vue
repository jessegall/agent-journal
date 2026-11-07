<script setup>
import {computed} from "vue";
import {useWindow} from "@journal/window-kit";

const view = useWindow();
const rows = computed(() => view.props.limits.rows.value ?? []);
const limit = (value) => (value === 0 ? "no limit" : value);
</script>

<template>
    <section class="agents" data-agent-settings-agents>
        <p v-if="!rows.length" class="agents-empty">No agent types report limits.</p>
        <article v-for="row in rows" :key="row.key" class="agents-type" :data-agent-type="row.key">
            <h3 class="agents-title">{{ row.label }}</h3>
            <p class="agents-count">{{ row.running }} running of {{ row.run_limit }}, {{ row.kept }} kept of {{ limit(row.kept_limit) }}</p>
            <ul v-if="row.profiles?.length" class="agents-profiles">
                <li v-for="profile in row.profiles" :key="profile.profile" :data-agent-profile="profile.profile">
                    {{ profile.title }} <span class="agents-group">{{ profile.group }}</span>: {{ profile.running }} running of {{ profile.run_limit }}, {{ profile.kept }} kept of {{ limit(profile.kept_limit) }}
                </li>
            </ul>
        </article>
    </section>
</template>

<style scoped>
.agents { display: flex; flex-direction: column; gap: 12px; padding: 12px; }
.agents-title { margin: 0; font-size: 13px; }
.agents-count, .agents-profiles, .agents-empty { margin: 0; font-size: 12px; color: var(--text-2); }
.agents-profiles { padding-left: 16px; }
.agents-group { color: var(--text-3, var(--text-2)); font-size: 11px; }
</style>
