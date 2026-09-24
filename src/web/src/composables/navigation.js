import {computed} from "vue";
import {PAGES, RESOURCE_GROUPS, SIDEBAR} from "../domain/navigation.js";
import {boardOn, counted, types} from "../state/store.js";

const countOf = (t) => counted(t.name, t.needs_attention ? "unread" : "open");

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
                ...(boardOn.value ? [{...pageLink("kanban"), count: counted("todo")}] : []),
                ...daily("project"),
                pageLink("plugins"),
                pageLink("resources"),
            ],
        },
    ]);
    const everywhere = computed(() => [...sections.value.flatMap((s) => s.links), ...groups.value.flatMap((g) => g.links)]);
    return {sections, groups, everywhere};
}
