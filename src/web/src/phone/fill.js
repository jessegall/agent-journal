import {onMounted, onUnmounted} from "vue";

const SLACK = 2;
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
    const [narrow, long] = [Math.min(screen.width, screen.height), Math.max(screen.width, screen.height)];
    const [wide, tall] = window.innerHeight >= window.innerWidth ? [narrow, long] : [long, narrow];
    const short = tall - window.innerHeight;
    const fits = standalone() && iPhone() && wide === window.innerWidth && short > 0 && short <= topInset() + SLACK;
    if (fits) root.style.setProperty("--app-height", `${tall}px`);
    else root.style.removeProperty("--app-height");
}

let frame = 0;

function soon() {
    cancelAnimationFrame(frame);
    frame = requestAnimationFrame(measured);
}

const returned = () => !document.hidden && soon();

export function useScreenFill() {
    onMounted(() => {
        measured();
        EVENTS.forEach((name) => window.addEventListener(name, soon));
        document.addEventListener("visibilitychange", returned);
    });
    onUnmounted(() => {
        cancelAnimationFrame(frame);
        EVENTS.forEach((name) => window.removeEventListener(name, soon));
        document.removeEventListener("visibilitychange", returned);
    });
}
