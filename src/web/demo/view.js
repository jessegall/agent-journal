const VIEW = "view";
const PHONE = "phone";

const asked = () => new URL(location.href);

export const framedAsPhone = () => asked().searchParams.get(VIEW) === PHONE && window.top === window;
export const insideFrame = () => window.top !== window;

export function innerAddress() {
    const url = asked();
    url.searchParams.delete(VIEW);
    return url.toString();
}

export function viewAs(view) {
    const url = asked();
    if (view === PHONE) url.searchParams.set(VIEW, PHONE);
    else url.searchParams.delete(VIEW);
    location.assign(url.toString());
}
