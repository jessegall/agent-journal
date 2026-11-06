import {ref, watch} from "vue";

export function useTextComments(source, read) {
    const comments = ref([]);
    const open = ref(false);
    const nextPage = ref(null);
    const total = ref(0);
    const loading = ref(false);
    const failure = ref("");
    let sent = 0;
    let reading = 0;

    const words = (row) => {
        if (typeof row.body === "string") return row.body;
        const {noun, id, title} = source();
        const named = `On ${noun} ${id}, ${title}: `;
        return row.text.startsWith(named) ? row.text.slice(named.length) : row.text;
    };

    async function load(page = 1) {
        const {noun, id} = source();
        if (!id) return;
        const turn = ++reading;
        loading.value = true;
        failure.value = "";
        try {
            const answer = await read([noun, "comments", String(id), "--page", String(page), "--page-size", "25"]);
            if (turn !== reading) return;
            if (!answer.ok) {
                failure.value = answer.error;
                return;
            }
            const rows = answer.value.rows ?? [];
            const combined = page === 1 ? rows : [...comments.value, ...rows];
            comments.value = [...new Map(combined.map((row) => [row.id, row])).values()];
            total.value = answer.value.total ?? comments.value.length;
            nextPage.value = answer.value.next_page ?? null;
        } catch (error) {
            if (turn === reading) failure.value = error.message;
        } finally {
            if (turn === reading) loading.value = false;
        }
    }

    async function send(text) {
        const {noun, id} = source();
        const selected = `${noun}:${id}`;
        const shown = {id: `sending-${++sent}`, text};
        comments.value = [...comments.value, shown];
        total.value++;
        open.value = true;
        const answer = await read([noun, "comment", String(id), text]);
        if (selected !== `${source().noun}:${source().id}`) return;
        if (!answer.ok) {
            comments.value = comments.value.filter((row) => row.id !== shown.id);
            total.value = Math.max(0, total.value - 1);
            throw new Error(answer.error);
        }
        await load();
        const savedId = answer.value?.id;
        if (savedId && !comments.value.some((row) => row.id === savedId)) comments.value = [...comments.value, {...shown, id: savedId}];
    }

    const loadMore = () => !loading.value && nextPage.value && load(nextPage.value);
    watch(() => `${source().noun}:${source().id}`, () => {
        open.value = false;
        comments.value = [];
        nextPage.value = null;
        total.value = 0;
        failure.value = "";
        reading++;
        load();
    }, {immediate: true});
    return {comments, open, words, send, load, loadMore, nextPage, total, loading, failure};
}
