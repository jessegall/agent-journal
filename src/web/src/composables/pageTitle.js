import {pluralTitle} from "../domain/navigation.js";
import {meta} from "../domain/spec.js";
import {computed} from "vue";
import {route} from "../route.js";

const PAGES = {
    settings: "Settings",
    search: "Search",
    files: "Files",
    commit: "Commit",
    skills: "Skills",
    about: "About",
    plugins: "Plugins",
    secrets: "Secrets",
    page: "Plugin",
    hub: "Journals",
    file: "File",
    kanban: "Board",
    organization: "Organization",
    resources: "Resources",
};

export const pageTitle = computed(() =>
    !route.value.page ? "Home" : PAGES[route.value.page] || (meta(route.value.page) ? pluralTitle(meta(route.value.page).title) : route.value.page)
);
