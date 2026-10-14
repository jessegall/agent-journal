import {ref} from "vue";

const SEEN = "phone-tour-seen";

export const TOUR = [
    {
        title: "Talk to the agent here",
        body: "In the lit bar, the left button says which journal and environment you are in; tap it to switch. The right button opens the main agent's controls.",
        target: ".chat-top",
        tab: "chat",
    },
    {
        title: "Act on a to-do",
        body: "The lit tab holds your to-dos. Swipe a to-do right to mark it done, or left to block it. Or press ⋯ on any line to see everything you can do.",
        target: ".tab[data-tab=todos]",
    },
    {
        title: "Other places",
        body: "The lit tab lists every other place the desktop has: plans, documents, triggers, plugins, settings and more.",
        target: ".tab[data-tab=everything]",
    },
];

export const touring = ref(null);

function seen() {
    try {
        return localStorage.getItem(SEEN) === "1";
    } catch {
        return true;
    }
}

export function startTour() {
    touring.value = 0;
}

export function startTourOnce() {
    if (!seen()) startTour();
}

export function endTour() {
    touring.value = null;
    try {
        localStorage.setItem(SEEN, "1");
    } catch {
        return;
    }
}
