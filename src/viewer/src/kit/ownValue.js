// A field owns its words: the value bound to it is written into the box when the box is mounted and whenever the bound value
// changes while the box has no focus; a box with focus keeps what the user typed or pasted, since a redraw around it, a poll
// landing, a row reloaded, must never write an older value over it.
export const ownValue = {
    mounted(el, {value}) {
        el.value = value ?? "";
    },
    beforeUpdate(el, {value, oldValue}) {
        if (value === oldValue || document.activeElement === el) return;
        el.value = value ?? "";
    },
};
