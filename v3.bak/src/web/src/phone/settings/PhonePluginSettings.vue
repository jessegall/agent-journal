<script setup>
import {onMounted, ref} from "vue";
import {api} from "../../api/client.js";
import {pluginFrom} from "../../composables/plugins.js";
import {settingGroups} from "../../domain/pluginSettings.js";
import Cell from "../kit/Cell.vue";
import CellGroup from "../kit/CellGroup.vue";
import EmptyList from "../kit/EmptyList.vue";

const emit = defineEmits(["open"]);
const plugins = ref(null);
const line = (p) => {
    const flags = settingGroups(p).flatMap((group) => group.flags);
    return flags.length ? `${flags.filter((s) => s.value === "true").length} of ${flags.length} switched on` : `${p.settings.length} settings`;
};

onMounted(async () => {
    const got = await api.list("plugin", {last: 100});
    plugins.value = got.rows.map(pluginFrom).filter((p) => p.settings.length);
});
</script>

<template>
    <template v-if="plugins && !plugins.length">
        <EmptyList icon="plug" title="No plugin has settings" reason="Plugins that offer settings show up here." />
    </template>
    <template v-if="plugins && plugins.length">
        <CellGroup>
            <template v-for="p in plugins" :key="p.n">
                <Cell :label="p.title" :sub="line(p)" icon="plug" @pick="emit('open', `pluginsettings:${p.n}`)" />
            </template>
        </CellGroup>
    </template>
</template>
