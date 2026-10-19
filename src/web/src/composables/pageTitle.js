import {pluralTitle} from "../domain/navigation.js";
import {meta} from "../domain/tables.js";
import {computed} from "vue";
import {route} from "../route.js";

const PAGES = {
    settings: "Settings",
    search: "Search",
    files: "Files",
    skills: "Skills",
    profiles: "Profiles",
    about: "About",
    plugins: "Plugins",
    mcp: "MCP",
    chart: "Workflows",
    secrets: "Secrets",
    file: "File",
    resources: "Resources",
};

export const pageTitle = computed(() =>
    !route.value.page
        ? "Home"
        : PAGES[route.value.page] || (meta(route.value.page) ? pluralTitle(meta(route.value.page).title) : route.value.page)
);
