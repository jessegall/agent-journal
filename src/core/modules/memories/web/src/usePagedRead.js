import {computed} from "vue";
import {useWindow} from "@journal/window-kit";

export function usePagedRead(name, flags, size, events) {
    const window = useWindow();
    const prop = window.props[name];
    let pages = 1;

    async function load() {
        const prefix = `${name}.`;
        Object.keys(window.state).filter((key) => key.startsWith(prefix)).forEach((key) => delete window.state[key]);
        Object.entries(flags(size * pages)).forEach(([key, value]) => (window.state[`${prefix}${key}`] = String(value)));
        await window.reload(name);
    }

    const reset = () => {
        pages = 1;
        return load();
    };
    const more = () => {
        pages += 1;
        return load();
    };
    window.follow(events, load);
    load();
    return {rows: prop.rows, total: computed(() => prop.data.value?.total ?? 0), failure: prop.failure, loaded: prop.loaded,
        load, reset, more, hasMore: computed(() => prop.rows.value.length < (prop.data.value?.total ?? 0))};
}
