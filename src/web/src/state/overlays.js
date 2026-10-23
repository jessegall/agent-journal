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

// The update report opened over the chat from its card above it: its id, and the chat it belongs to.
export const updateView = reactive({id: 0, owner: null});

export function openUpdate(id, owner) {
    updateView.owner = markRaw(owner);
    updateView.id = id;
}

export function closeUpdate() {
    updateView.id = 0;
    updateView.owner = null;
}
