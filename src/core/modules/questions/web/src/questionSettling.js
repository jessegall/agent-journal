import {ref} from "vue";

// answering, closing and asking again about one question from a card: the change shows at once and goes back if the server refuses it
export function useQuestionSettling(row, run, emit) {
    const settled = ref(null);
    const refusal = ref("");
    const elaborated = ref(false);

    async function settle(change, line) {
        settled.value = change;
        refusal.value = "";
        const answer = await run(line);
        if (answer.ok) return void emit("changed");
        settled.value = null;
        refusal.value = answer.error;
    }

    const answer = (text) => settle({state: "answered", answer: text}, ["question", "answer", String(row().id), "--answer", text]);
    const close = () => settle({state: "closed"}, ["question", "close", String(row().id)]);

    async function elaborate() {
        elaborated.value = true;
        const sent = await run(["message", "send", `Elaborate on question ${row().id}: ask it again with more context on each option and which you would pick, and you choose.`]);
        if (sent.ok) return;
        elaborated.value = false;
        refusal.value = sent.error;
    }

    return {settled, refusal, elaborated, answer, close, elaborate};
}
