import {onMounted, onUnmounted} from "vue";

const MOST_SHORT = 80;

const standalone = () => window.matchMedia?.("(display-mode: standalone)").matches || navigator.standalone === true;

function measured() {
    const root = document.documentElement;
    const [narrow, long] = [Math.min(screen.width, screen.height), Math.max(screen.width, screen.height)];
    const [wide, tall] = window.innerHeight >= window.innerWidth ? [narrow, long] : [long, narrow];
    const short = tall - window.innerHeight;
    if (standalone() && wide === window.innerWidth && short > 0 && short <= MOST_SHORT) root.style.setProperty("--app-height", `${tall}px`);
    else root.style.removeProperty("--app-height");
}

export function useScreenFill() {
    onMounted(() => {
        measured();
        window.addEventListener("resize", measured);
        window.addEventListener("pageshow", measured);
        window.addEventListener("orientationchange", measured);
    });
    onUnmounted(() => {
        window.removeEventListener("resize", measured);
        window.removeEventListener("pageshow", measured);
        window.removeEventListener("orientationchange", measured);
    });
}
