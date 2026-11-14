import {watch} from "vue";

// a value kept in the browser's storage, or the fallback when it holds none or cannot be read
function readFrom(storage, key, fallback) {
    try {
        const got = storage().getItem(key);
        return got === null ? fallback : JSON.parse(got);
    } catch (e) {
        return fallback;
    }
}

export function remembered(key, fallback) {
    return readFrom(() => localStorage, key, fallback);
}

// a value kept in the browser's storage; false when the storage cannot be written
function writeTo(storage, key, value) {
    try {
        storage().setItem(key, JSON.stringify(value));
        return true;
    } catch (e) {
        return false;
    }
}

export function remember(key, value) {
    return writeTo(() => localStorage, key, value);
}

export function kept(key, source) {
    watch(source, (value) => remember(key, value), {deep: true});
}

export function rememberedInTab(key, fallback) {
    return readFrom(() => sessionStorage, key, fallback);
}

export function rememberInTab(key, value) {
    return writeTo(() => sessionStorage, key, value);
}
