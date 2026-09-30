import {onMounted, onUnmounted} from "vue";

const SLACK = 2;
const STATUS_BAR = 62;
const SETTLED = 400;
const EVENTS = ["resize", "pageshow", "orientationchange"];

const standalone = () => window.matchMedia?.("(display-mode: standalone)").matches || navigator.standalone === true;
const iPhone = () => /iPhone/.test(navigator.userAgent);

function topInset() {
    const probe = document.createElement("div");
    probe.style.cssText = "position:fixed;top:0;left:0;visibility:hidden;padding-top:env(safe-area-inset-top)";
    document.body.appendChild(probe);
    const inset = parseFloat(getComputedStyle(probe).paddingTop) || 0;
    probe.remove();
    return inset;
}

function measured() {
    const root = document.documentElement;
    const app = document.querySelector(".phone");
    root.style.removeProperty("--app-height");
    if (!app || !standalone() || !iPhone()) return;
    const [narrow, long] = [Math.min(screen.width, screen.height), Math.max(screen.width, screen.height)];
    const [wide, tall] = window.innerHeight >= window.innerWidth ? [narrow, long] : [long, narrow];
    const short = tall - app.getBoundingClientRect().bottom;
    if (wide === window.innerWidth && short > 0 && short <= Math.max(topInset(), STATUS_BAR) + SLACK) root.style.setProperty("--app-height", `${tall}px`);
}

let frame = 0;
let later = 0;

function soon() {
    cancelAnimationFrame(frame);
    frame = requestAnimationFrame(measured);
}

const returned = () => !document.hidden && soon();

export function useScreenFill() {
    onMounted(() => {
        measured();
        later = setTimeout(soon, SETTLED);
        EVENTS.forEach((name) => window.addEventListener(name, soon));
        document.addEventListener("visibilitychange", returned);
    });
    onUnmounted(() => {
        cancelAnimationFrame(frame);
        clearTimeout(later);
        EVENTS.forEach((name) => window.removeEventListener(name, soon));
        document.removeEventListener("visibilitychange", returned);
    });
}
