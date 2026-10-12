import {createApp, h, nextTick} from "vue";

// the element a component is drawn into, with `slot` as its default slot when given
export async function shown(component, props, slot) {
    const host = window.document.createElement("div");
    createApp({render: () => h(component, props, slot)}).mount(host);
    await nextTick();
    return host;
}
