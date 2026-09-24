import {computed} from "vue";
import {PAGES, RESOURCE_GROUPS, SIDEBAR} from "../domain/navigation.js";
import {counted, types} from "../state/store.js";

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
    const everywhere = computed(() => [
        ...sidebar.value,
        pageLink("plugins"),
        pageLink("resources"),
        ...groups.value.flatMap((g) => g.links),
    ]);
    return {sidebar, groups, everywhere};
}
