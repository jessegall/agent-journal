import {onPhone} from "../platform/phone.js";
import {recordCount} from "../domain/records.js";
import {tables} from "../domain/tables.js";
import {computed} from "vue";
import {PAGES, RESOURCE_GROUPS, SIDEBAR, pluralTitle} from "../domain/navigation.js";

const countOf = (t) => recordCount(t.name, t.needs_attention ? "unread" : "open");

const typeLink = (t) => ({
    key: t.name,
    page: t.name,
    title: pluralTitle(t.title),
    icon: t.icon,
    text: t.abstract,
    count: countOf(t),
    hot: !!t.needs_attention && !!countOf(t),
});

// the pages that set how the journal runs: the desk's alone, since a phone changes none of it
const CONFIGURING = ["plugins", "mcp", "chart", "profiles", "secrets", "settings"];

const pageLink = (key) => ({key, page: key, count: 0, hot: false, ...PAGES[key]});

export function useNavigation() {
    const listed = computed(() => tables.value.filter((t) => t.in_sidebar));
    const sidebar = computed(() => listed.value.filter((t) => t.listed_under === SIDEBAR).map((t) => ({...typeLink(t), scope: t.scope})));
    const groups = computed(() =>
        RESOURCE_GROUPS.map((g) => ({
            key: g.key,
            title: g.title,
            links: [...listed.value.filter((t) => t.listed_under === g.key).map(typeLink), ...g.pages.filter((key) => !(onPhone && CONFIGURING.includes(key))).map(pageLink)],
        })).filter((g) => g.links.length)
    );
    const daily = (scope) => sidebar.value.filter((link) => link.scope === scope);
    const sections = computed(() => [
        {key: "environment", label: "Environment", links: [pageLink(""), ...daily("environment")]},
        {
            key: "project",
            label: "Project",
            links: [...daily("project"), pageLink("code"), ...(onPhone ? [] : CONFIGURING.map(pageLink)), pageLink("resources")],
        },
    ]);
    const everywhere = computed(() => [...sections.value.flatMap((s) => s.links), ...groups.value.flatMap((g) => g.links)]);
    return {sections, groups, everywhere};
}
