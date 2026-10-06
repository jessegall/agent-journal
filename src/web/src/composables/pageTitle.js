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
    page: "Plugin",
    hub: "All journals",
    file: "File",
    kanban: "Board",
    organization: "Organization",
    resources: "Resources",
};

export const pageTitle = computed(() =>
    !route.value.page ? "Home" : PAGES[route.value.page] || (meta(route.value.page) ? `${meta(route.value.page).title}s` : route.value.page)
);
