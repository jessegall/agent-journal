import {createApp, h, nextTick, reactive} from "vue";

// draws one setting component with the props given and the slots given, and keeps what it emits, by event name; the
// props are kept reactive so a test can change them the way a screen does
export function drawnSettingComponent(component, props = {}, slots = {}) {
    const state = reactive({...props});
    const emitted = {};
    const element = document.createElement("div");
    document.body.appendChild(element);
    const listeners = {};
    for (const name of ["update:modelValue", "update:ownValue", "change", "choose", "open", "back", "retry", "pick", "open-page", "fill"]) {
        listeners[`on${name.charAt(0).toUpperCase()}${name.slice(1)}`] = (...values) => (emitted[name] ??= []).push(values.length > 1 ? values : values[0]);
    }
    createApp({render: () => h(component, {...state, ...listeners}, slots)}).mount(element);
    return {element, emitted, state, settled: () => nextTick()};
}
