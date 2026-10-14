import {word} from "../domain/spec.js";
import {api} from "../api/client.js";
import {usePromised} from "../composables/promised.js";

const {pending, promise, change, drop} = usePromised();
const givenFor = (question) => pending.value.find((p) => p.about === question.ref);

export function answered(question) {
    const given = question && givenFor(question);
    if (!given || given.brief === question.outcome) return question;
    if (given.failed) return {...question, unsaved: given.brief};
    return {
        ...question,
        completed: question.completed || given.created,
        outcome: given.brief,
        data: {...question.data, chosen: 0, answered_by: "user", reason: ""},
    };
}

export async function answer(question, choice) {
    pending.value.filter((p) => p.about === question.ref).forEach(drop);
    const made = promise({type: "answer", about: question.ref, brief: choice});
    try {
        if (question.completed) await api.act(question.type, question.n, "set", {key: "outcome", value: choice});
        else await api.act(question.type, question.n, word(question.type, "complete"), {how: choice});
    } catch (e) {
        change(made, {failed: true});
    }
}

export const dismiss = (question, why) => api.dismissQuestion(question.n, why);
