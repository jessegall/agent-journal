import {watch} from "vue";

export function remembered(key, fallback) {
    try {
        const got = localStorage.getItem(key);
        return got === null ? fallback : JSON.parse(got);
    } catch (e) {
        return fallback;
    }
}

export function remember(key, value) {
    try {
        localStorage.setItem(key, JSON.stringify(value));
        return true;
    } catch (e) {
        return false;
    }
}

export function kept(key, source) {
    watch(source, (value) => remember(key, value), {deep: true});
}
