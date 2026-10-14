export function firstTime(key) {
    try {
        if (localStorage.getItem(key)) return false;
        localStorage.setItem(key, "1");
        return true;
    } catch (error) {
        return false;
    }
}
