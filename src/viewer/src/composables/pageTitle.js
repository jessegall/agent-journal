import {PAGES, pluralTitle} from "../domain/navigation.js";
import {meta} from "../domain/tables.js";
import {computed} from "vue";
import {route} from "../route.js";

const TITLES = {search: "Search", about: "About", file: "File"};

export const pageTitle = computed(() =>
    !route.value.page
        ? "Home"
        : PAGES[route.value.page]?.title || TITLES[route.value.page] || (meta(route.value.page) ? pluralTitle(meta(route.value.page).title) : route.value.page)
);
