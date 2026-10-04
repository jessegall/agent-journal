import {markRaw, reactive} from "vue";

function overlayView() {
    const view = reactive({n: 0, owner: null});
    const open = (n, owner) => {
        view.owner = markRaw(owner);
        view.n = n;
    };
    const close = () => {
        view.n = 0;
        view.owner = null;
    };
    return {view, open, close};
}

const question = overlayView();
const update = overlayView();

export const questionView = question.view;
export const openQuestion = question.open;
export const closeQuestion = question.close;
export const updateView = update.view;
export const openUpdate = update.open;
export const closeUpdate = update.close;
