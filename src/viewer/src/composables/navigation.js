import {onPhone} from "../platform/phone.js";
import {recordCount} from "../domain/records.js";
import {tables} from "../domain/tables.js";
import {computed} from "vue";
import {PAGES, RESOURCE_GROUPS, SIDEBAR, pluralTitle} from "../domain/navigation.js";

const countOf = (t) => recordCount(t.name, t.needs_attention ? "unread" : "open");
// what a link's count counts, where its number alone would mislead: the tasks counted are those outside a plan, whose own are on its bar
const COUNT_TITLES = {tasks: "open tasks outside a plan"};

const typeLink = (t) => ({
    key: t.name,
    page: t.name,
    title: pluralTitle(t.title),
    icon: t.icon,
    text: t.abstract,
    count: countOf(t),
    countTitle: COUNT_TITLES[t.name] || "",
    hot: !!t.needs_attention && !!countOf(t),
});

// the pages that set how the journal runs: the desk's alone, since a phone changes none of it
const CONFIGURING = ["plugins", "mcp", "profiles", "secrets", "team", "settings"];

const pageLink = (key) => ({key, page: key, count: 0, hot: false, ...PAGES[key]});
const deskLinks = (keys) => keys.filter((key) => !(onPhone && CONFIGURING.includes(key))).map(pageLink);

export function useNavigation() {
    const listed = computed(() => tables.value.filter((t) => t.in_sidebar));
    const sidebar = computed(() => listed.value.filter((t) => t.listed_under === SIDEBAR).map((t) => ({...typeLink(t), scope: t.scope})));
    const groups = computed(() =>
        RESOURCE_GROUPS.map((g) => ({
            key: g.key,
            title: g.title,
            links: [...listed.value.filter((t) => t.listed_under === g.key).map(typeLink), ...deskLinks(g.pages)],
        })).filter((g) => g.links.length)
    );
    const daily = (scope) => sidebar.value.filter((link) => link.scope === scope);
    const sections = computed(() => [
        {key: "environment", label: "Environment", links: [pageLink(""), ...daily("environment")]},
        {
            key: "project",
            label: "Project",
            links: [...daily("project"), ...deskLinks(["files", "git", "plugins", "mcp", "profiles", "secrets", "team", "resources", "settings"])],
        },
    ]);
    const everywhere = computed(() => [...sections.value.flatMap((s) => s.links), ...groups.value.flatMap((g) => g.links)]);
    return {sections, groups, everywhere};
}
