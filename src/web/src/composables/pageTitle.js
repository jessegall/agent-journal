import {computed} from "vue";
import {route} from "../route.js";
import {meta} from "../state/store.js";

const PAGES = {
    settings: "Settings",
    search: "Search",
    files: "Files",
    commit: "Commit",
    skills: "Skills",
    services: "Services",
    about: "About",
    plugins: "Plugins",
    page: "Plugin",
    hub: "Hub",
    file: "File",
    kanban: "Board",
    organization: "Organization",
    resources: "Resources",
};

export const pageTitle = computed(() =>
    !route.value.page ? "Home" : PAGES[route.value.page] || (meta(route.value.page) ? `${meta(route.value.page).title}s` : route.value.page)
);
