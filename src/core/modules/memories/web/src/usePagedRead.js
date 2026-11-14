import {computed} from "vue";
import {useWindow} from "@journal/window-kit";

export function usePagedRead(name, flags, size, events) {
    const view = useWindow();
    const prop = view.props[name];
    let pages = 1;

    async function load() {
        const prefix = `${name}.`;
        Object.keys(view.state).filter((key) => key.startsWith(prefix)).forEach((key) => delete view.state[key]);
        Object.entries(flags(size * pages)).forEach(([key, value]) => (view.state[`${prefix}${key}`] = String(value)));
        await view.reload(name);
    }

    const reset = () => {
        pages = 1;
        return load();
    };
    const more = () => {
        pages += 1;
        return load();
    };
    view.follow(events, load);
    load();
    return {rows: prop.rows, total: computed(() => prop.data.value?.total ?? 0), failure: prop.failure, loaded: prop.loaded,
        load, reset, more, hasMore: computed(() => prop.rows.value.length < (prop.data.value?.total ?? 0))};
}
