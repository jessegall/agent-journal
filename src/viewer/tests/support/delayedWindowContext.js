import {mounted as mount, settle as tick} from "./windowContext.js";

export async function settle(delay = 80) {
    await tick();
    await new Promise((resolve) => setTimeout(resolve, delay));
    await tick();
}

export async function mounted(component, window, delay = 80) {
    const element = await mount(component, window);
    await settle(delay);
    return element;
}
