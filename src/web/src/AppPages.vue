<script setup>
import SwitchCase from "./kit/SwitchCase.vue";
import AboutPage from "./pages/AboutPage.vue";
import BoardPage from "./pages/BoardPage.vue";
import CommitPage from "./pages/CommitPage.vue";
import FilePage from "./pages/FilePage.vue";
import FilesPage from "./pages/FilesPage.vue";
import Home from "./pages/Home.vue";
import HubPage from "./pages/HubPage.vue";
import Index from "./pages/Index.vue";
import IntegrationsPage from "./pages/IntegrationsPage.vue";
import OrganizationPage from "./pages/OrganizationPage.vue";
import PluginPage from "./pages/PluginPage.vue";
import PluginsPage from "./pages/PluginsPage.vue";
import ResourcesPage from "./pages/ResourcesPage.vue";
import SearchPage from "./pages/SearchPage.vue";
import SecretsPage from "./pages/SecretsPage.vue";
import SettingsPage from "./pages/SettingsPage.vue";
import SkillsPage from "./pages/SkillsPage.vue";
import {route} from "./route.js";

defineProps({page: {type: String, required: true}});
</script>

<template>
    <SwitchCase :value="page">
        <template #home><Home /></template>
        <template #settings><SettingsPage /></template>
        <template #search><SearchPage /></template>
        <template #files><FilesPage /></template>
        <template #commit><CommitPage /></template>
        <template #skills><SkillsPage /></template>
        <template #about><AboutPage /></template>
        <template #plugins><PluginsPage /></template>
        <template #secrets><SecretsPage /></template>
        <template #integrations><IntegrationsPage /></template>
        <template #kanban><BoardPage /></template>
        <template #organization><OrganizationPage /></template>
        <template #resources><ResourcesPage /></template>
        <template #page><PluginPage /></template>
        <template #hub><HubPage /></template>
        <template #file><FilePage /></template>
        <template #default><Index :type="route.page" /></template>
    </SwitchCase>
</template>
