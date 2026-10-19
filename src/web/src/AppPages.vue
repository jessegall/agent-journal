<script setup>
import SwitchCase from "./kit/SwitchCase.vue";
import AboutPage from "./pages/AboutPage.vue";
import CodePage from "./pages/CodePage.vue";
import FilePage from "./pages/FilePage.vue";
import FilesPage from "./pages/FilesPage.vue";
import Home from "./pages/Home.vue";
import Index from "./pages/Index.vue";
import IntegrationsPage from "./pages/IntegrationsPage.vue";
import ChartPage from "./pages/ChartPage.vue";
import PluginsPage from "./pages/PluginsPage.vue";
import ResourcesPage from "./pages/ResourcesPage.vue";
import SearchPage from "./pages/SearchPage.vue";
import SecretsPage from "./pages/SecretsPage.vue";
import SettingsPage from "./pages/SettingsPage.vue";
import SkillsPage from "./pages/SkillsPage.vue";
import AgentProfilesPage from "./pages/AgentProfilesPage.vue";
import {route} from "./route.js";

defineProps({page: {type: String, required: true}});
</script>

<template>
    <SwitchCase :value="page">
        <template #home><Home /></template>
        <template #settings><SettingsPage /></template>
        <template #search><SearchPage /></template>
        <template #files><FilesPage /></template>
        <template #code><CodePage /></template>
        <template #skills><SkillsPage /></template>
        <template #profiles><AgentProfilesPage /></template>
        <template #about><AboutPage /></template>
        <template #plugins><PluginsPage /></template>
        <template #secrets><SecretsPage /></template>
        <template #mcp><IntegrationsPage /></template>
        <template #chart><ChartPage /></template>
        <template #resources><ResourcesPage /></template>
        <template #file><FilePage /></template>
        <template #default><Index :table="route.page" /></template>
    </SwitchCase>
</template>
