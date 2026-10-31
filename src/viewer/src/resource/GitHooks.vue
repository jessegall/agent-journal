<script setup>
import {onMounted, ref} from "vue";
import {api} from "../api/client.js";
import Chip from "../kit/Chip.vue";

const hooks = ref([]);
onMounted(async () => {
    try {
        hooks.value = await api.gitHooks();
    } catch {
        hooks.value = [];
    }
});
</script>

<template>
    <template v-if="hooks.length">
        <section class="git-hooks">
            <h3 class="git-hooks-head">Git hooks</h3>
            <p class="git-hooks-line">Git runs these on its own; they are shown here and changed in the repository.</p>
            <template v-for="hook in hooks" :key="hook.name">
                <div class="git-hook" :data-hook="hook.name">
                    <span class="git-hook-name">{{ hook.name }}</span>
                    <Chip>{{ hook.is_active ? "active" : "not running" }}</Chip>
                    <span class="git-hook-purpose">{{ hook.purpose }}</span>
                    <code class="git-hook-commands">{{ hook.commands.join(" ; ") }}</code>
                </div>
            </template>
        </section>
    </template>
</template>

<style scoped>
.git-hooks {
    padding: 18px 22px 28px;
}

.git-hooks-head {
    margin: 0 0 6px;
    color: var(--text-3);
    font-size: 11.5px;
    font-weight: 500;
    letter-spacing: 0.04em;
    text-transform: uppercase;
}

.git-hooks-line {
    margin: 0 0 10px;
    color: var(--text-3);
    font-size: 12px;
}

.git-hook {
    display: flex;
    flex-wrap: wrap;
    align-items: baseline;
    gap: 8px 12px;
    padding: 8px 0;
    border-bottom: 1px solid var(--border);
}

.git-hook-name {
    min-width: 120px;
    color: var(--text);
    font-weight: 500;
}

.git-hook-purpose {
    color: var(--text-2);
    font-size: 12.5px;
}

.git-hook-commands {
    flex: 1 0 100%;
    color: var(--text-3);
    font-size: 11.5px;
    overflow-wrap: anywhere;
}
</style>
