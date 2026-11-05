import {ref, watch} from "vue";

// the comments on a document or report, read when it opens; a comment sent shows at once and opens the comments, and comes off again if it is refused
export function useTextComments(source, read) {
    const comments = ref([]);
    const open = ref(false);
    let sent = 0;
    let reading = 0;

    // a comment reaches the chat as "On doc 1, Title: words", and here it is under the document already
    const words = (row) => {
        const {noun, id, title} = source();
        const named = `On ${noun} ${id}, ${title}: `;
        return row.text.startsWith(named) ? row.text.slice(named.length) : row.text;
    };

    async function load() {
        const {noun, id} = source();
        if (!id) return;
        const turn = ++reading;
        const answer = await read([noun, "comments", String(id)]);
        if (turn === reading) comments.value = answer.ok ? (answer.value.rows ?? []) : [];
    }

    async function send(text) {
        const {noun, id} = source();
        const shown = {id: `sending-${++sent}`, text};
        comments.value = [...comments.value, shown];
        open.value = true;
        const answer = await read([noun, "comment", String(id), text]);
        if (!answer.ok) {
            comments.value = comments.value.filter((row) => row !== shown && row.id !== shown.id);
            throw new Error(answer.error);
        }
        await load();
    }

    watch(() => source().id, () => {
        open.value = false;
        comments.value = [];
        load();
    }, {immediate: true});
    return {comments, open, words, send, load};
}
