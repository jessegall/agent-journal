import {boardOn} from "./settings.js";
import {recordCount} from "../domain/records.js";
import {types} from "../domain/spec.js";
import {computed} from "vue";
import {PAGES, RESOURCE_GROUPS, SIDEBAR} from "../domain/navigation.js";
import {demo} from "../platform/demo.js";

const countOf = (t) => recordCount(t.name, t.needs_attention ? "unread" : "open");

const typeLink = (t) => ({
    key: t.name,
    page: t.name,
    title: `${t.title}s`,
    icon: t.icon,
    text: t.abstract,
    count: countOf(t),
    hot: !!t.needs_attention && !!countOf(t),
});

const pageLink = (key) => ({key, page: key, count: 0, hot: false, ...PAGES[key]});

export function useNavigation() {
    const listed = computed(() => types.value.filter((t) => t.in_sidebar));
    const sidebar = computed(() => listed.value.filter((t) => t.listed_under === SIDEBAR).map((t) => ({...typeLink(t), scope: t.scope})));
    const groups = computed(() =>
        RESOURCE_GROUPS.map((g) => ({
            key: g.key,
            title: g.title,
            links: [...listed.value.filter((t) => t.listed_under === g.key).map(typeLink), ...g.pages.map(pageLink)],
        })).filter((g) => g.links.length)
    );
    const daily = (scope) => sidebar.value.filter((link) => link.scope === scope);
    const sections = computed(() => [
        {key: "environment", label: "Environment", links: [pageLink(""), ...daily("environment")]},
        {
            key: "project",
            label: "Project",
            links: [
                ...(boardOn.value ? [{...pageLink("kanban"), count: recordCount("todo")}] : []),
                ...daily("project"),
                ...(demo ? [] : [pageLink("plugins")]),
                pageLink("resources"),
                pageLink("settings"),
            ],
        },
    ]);
    const everywhere = computed(() => [...sections.value.flatMap((s) => s.links), ...groups.value.flatMap((g) => g.links)]);
    return {sections, groups, everywhere};
}
