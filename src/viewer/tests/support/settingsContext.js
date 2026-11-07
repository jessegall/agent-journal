import {context as baseContext, mounted as mount, settle as tick} from "./windowContext.js";

const KEYS = {
    settings: {line: "setting tree", tab: "settings", events: ["setting.*"]},
    environments: {line: "environment cards", tab: "environments", events: ["environment.*"]},
    commands: {line: "alias saved --limit 1000", events: ["alias.*"], loading: "requested"},
};

export const context = (answers) => baseContext(answers, null, KEYS);
export async function settle() {
    await tick();
    await new Promise((resolve) => setTimeout(resolve, 80));
    await tick();
}
export async function mounted(component, window) {
    const element = await mount(component, window);
    await settle();
    return element;
}
export {page, typeInto} from "./windowContext.js";
