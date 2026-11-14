import {createApp, h, nextTick, reactive} from "vue";

// draws one setting component with the props given and the slots given, and keeps what it emits, by event name; the
// props are kept reactive so a test can change them the way a screen does
export function drawnSettingComponent(component, props = {}, slots = {}) {
    const state = reactive({...props});
    const emitted = {};
    const element = document.createElement("div");
    document.body.appendChild(element);
    const listeners = {};
    for (const name of ["update:modelValue", "update:ownValue", "change", "choose", "open", "back", "retry", "pick", "open-page", "fill", "save", "cancel"]) {
        listeners[`on${name.charAt(0).toUpperCase()}${name.slice(1)}`] = (...values) => (emitted[name] ??= []).push(values.length > 1 ? values : values[0]);
    }
    createApp({render: () => h(component, {...state, ...listeners}, slots)}).mount(element);
    return {element, emitted, state, settled: () => nextTick()};
}

// types text into the input of a drawn component, or into the one the selector finds
export function typedInto(drawn, text, selector = "input") {
    const input = drawn.element.querySelector(selector);
    input.value = text;
    input.dispatchEvent(new Event("input"));
}

// types text into one entry of a drawn list of entries
export const typedEntry = (list, index, text) => typedInto(list, text, `[data-entry="${index}"]`);
