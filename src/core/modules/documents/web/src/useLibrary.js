import {onUnmounted, ref, watch} from "vue";

// the first page of the documents or the reports of one state, in one read, and a page more asked for before the lowest number held; read again when a document or a report changes
export function useLibrary(view, term, state) {
    const library = view.props.library;
    const rows = ref([]);
    const total = ref(0);
    const {failure, loaded} = library;
    view.state["library.type"] = term.value;
    view.state["library.state"] = state.value;
    watch(library.data, (value) => {
        rows.value = value.rows;
        total.value = value.total;
    }, {once: true});

    async function load() {
        const type = term.value;
        const shown = state.value;
        view.state["library.type"] = type;
        view.state["library.state"] = shown;
        delete view.state["library.before"];
        const refreshed = await view.reload("library");
        if (type !== term.value || shown !== state.value) return;
        rows.value = refreshed && !failure.value ? library.data.value.rows : [];
        total.value = refreshed && !failure.value ? library.data.value.total : 0;
        loaded.value = true;
    }

    async function more() {
        const type = term.value;
        const shown = state.value;
        view.state["library.before"] = String(Math.min(...rows.value.map((row) => row.id)));
        const refreshed = await view.reload("library");
        delete view.state["library.before"];
        if (!refreshed || failure.value) return;
        if (type === term.value && shown === state.value) rows.value = [...rows.value, ...library.data.value.rows];
    }

    watch([term, state], () => {
        rows.value = [];
        loaded.value = false;
        load();
    });
    const stop = view.follow(["doc.*", "report.*"], load);
    onUnmounted(() => stop?.());
    return {rows, total, failure, loaded, load, more};
}
