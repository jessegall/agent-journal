import {useKeyMap} from "./keyMap.js";

export const useSlashFocus = (field, on = () => true) => useKeyMap({"/": () => field.value?.focus()}, on);
