import {markRaw, reactive} from "vue";

export const questionView = reactive({n: 0, owner: null});

export function openQuestion(n, owner) {
    questionView.owner = markRaw(owner);
    questionView.n = n;
}

export function closeQuestion() {
    questionView.n = 0;
    questionView.owner = null;
}
