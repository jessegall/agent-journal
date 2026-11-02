import {ref, watch} from "vue";

// the comments on a document or report, read when it opens; a comment sent shows at once and opens the comments, and comes off again if it is refused
export function useTextComments(source, read) {
    const comments = ref([]);
    const open = ref(false);
    let sent = 0;

    // a comment reaches the chat as "On doc 1, Title: words", and here it is under the document already
    const words = (row) => {
        const {kind, id, title} = source();
        const named = `On ${kind} ${id}, ${title}: `;
        return row.text.startsWith(named) ? row.text.slice(named.length) : row.text;
    };

    async function load() {
        const {kind, id} = source();
        if (!id) return;
        const answer = await read([kind, "comments", String(id)]);
        comments.value = answer.ok ? (answer.value.rows ?? []) : [];
    }

    async function send(text) {
        const {kind, id} = source();
        const shown = {id: `sending-${++sent}`, text};
        comments.value = [...comments.value, shown];
        open.value = true;
        const answer = await read([kind, "comment", String(id), text]);
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
