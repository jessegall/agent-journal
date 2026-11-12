<script setup>
import {onMounted, ref} from "vue";
import {useWindow} from "@journal/window-kit";
import {SettingBanner, SettingHelperTypeTable} from "@journal/setting-components";
import AgentSettingsTypeScreen from "./AgentSettingsTypeScreen.vue";
import {useHelperRows} from "./helperRows.js";

// the helpers tab: how many agents of each type run and are kept against their limits, with the context cap of each,
// and the screen of a type over the table once a row is opened
const props = defineProps({draft: {type: Object, required: true}});
const view = useWindow();
const {rows, unreadable, reread} = useHelperRows(view, props.draft);
const opened = ref(null);

// the counts are read with the helpers tab, so a window opened on another tab reads them when this tab first shows
onMounted(reread);
const open = (key) => { opened.value = rows.value.find((row) => row.key === key); };
</script>

<template>
    <section class="agents" data-agent-settings-agents>
        <template v-if="opened">
            <AgentSettingsTypeScreen :row="opened" :draft="draft" :read-only="view.readOnly" @back="opened = null" />
        </template>
        <template v-else-if="unreadable">
            <SettingBanner kind="unreadable" text="The counts could not be read." @retry="reread" />
        </template>
        <template v-else>
            <SettingHelperTypeTable :rows="rows" @open="open" />
        </template>
    </section>
</template>

<style scoped>
.agents { display: flex; flex-direction: column; flex: 1; min-height: 0; overflow-y: auto; }
</style>
