const VIEW = "as";
const PHONE = "phone";
const DESKTOP = "desktop";
const SMALL = "(max-width: 640px) and (pointer: coarse)";

const asked = () => new URL(location.href);
const page = (name) => {
    const url = asked();
    url.pathname = url.pathname.replace(/[^/]*$/, name);
    url.hash = "";
    return url;
};

export const framedAsPhone = () => asked().searchParams.get(VIEW) === PHONE && window.top === window;
export const insideFrame = () => window.top !== window;
export const onAPhone = () => window.top === window && asked().searchParams.get(VIEW) !== DESKTOP && matchMedia(SMALL).matches;

export function phoneAddress() {
    const url = page("phone.html");
    url.searchParams.delete(VIEW);
    return url.toString();
}

export function viewAs(view) {
    const url = page("index.html");
    url.searchParams.set(VIEW, view);
    location.assign(url.toString());
}
