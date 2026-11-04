<script setup>
import {RowList, useRows} from "@journal/window-kit";

const {rows, failure, loaded} = useRows("alias saved --limit 1000", ["alias.*"]);
</script>

<template>
    <section data-command-settings>
        <h3>Command classification</h3>
        <p>Commands are classified by the program and arguments they run. Test and build commands use saved commands.</p>
        <RowList :rows="rows" :failure="failure" :loaded="loaded" empty="No saved test or build commands" hint="Agents can add saved commands with journal alias add.">
            <template #default="{row}">
                <div class="command" :data-saved-command="row.name">
                    <strong>{{ row.name }}</strong>
                    <code>{{ row.line }}</code>
                    <span>{{ row.category }}</span>
                </div>
            </template>
        </RowList>
    </section>
</template>

<style scoped>
section { min-width: 0; }
h3 { margin: 0 0 12px; font-size: 13px; }
p { color: var(--text-2); }
.command { display: flex; flex: 1; gap: 16px; align-items: center; min-width: 0; }
.command code { flex: 1; overflow-wrap: anywhere; }
.command span { color: var(--text-3); }
</style>
