import {api} from "../api/client.js";
import {usePromised} from "../composables/promised.js";

const {pending, promise, change, drop} = usePromised();
const givenFor = (question) => pending.value.find((p) => p.question_id === question.id);

// A question with the answer the user just gave laid over it, until the journal's own row carries it.
export function answered(question) {
    const given = question && givenFor(question);
    if (!given || given.text === question.answer) return question;
    if (given.failed) return {...question, unsaved: given.text};
    return {...question, answer: given.text};
}

export async function answer(question, choice) {
    pending.value.filter((p) => p.question_id === question.id).forEach(drop);
    const made = promise("answers", {question_id: question.id, text: choice});
    try {
        await api.act("questions", question.id, "answer", {answer: choice});
    } catch (e) {
        change(made, {failed: true});
    }
}
