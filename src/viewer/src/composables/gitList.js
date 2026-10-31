import {ref} from "vue";

// A list of the Git page read a page at a time from one of the API's routes: the rows so far, whether there are more, and the next page.
export function useGitList(read) {
    const rows = ref([]);
    const more = ref(false);
    const loaded = ref(false);
    const failure = ref("");
    async function load() {
        try {
            const page = await read(rows.value.length);
            rows.value = [...rows.value, ...page.rows];
            more.value = !page.is_last_page;
        } catch (e) {
            failure.value = e.message;
        }
        loaded.value = true;
    }
    return {rows, more, loaded, failure, load};
}
