import {markRaw, reactive} from "vue";

// The question opened over the chat that asked it: its id, and the chat it belongs to.
export const questionView = reactive({id: 0, owner: null});

export function openQuestion(id, owner) {
    questionView.owner = markRaw(owner);
    questionView.id = id;
}

export function closeQuestion() {
    questionView.id = 0;
    questionView.owner = null;
}
