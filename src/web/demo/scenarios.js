import {LESSONS} from "./lessons.js";

export {LESSONS};

const LESSON = "scenario";
const asked = new URLSearchParams(location.search).get(LESSON);

export const picked = LESSONS.find((one) => one.key === asked);

export const scenario = picked || LESSONS[0];

function opened(key) {
    const url = new URL(location.href);
    if (key) url.searchParams.set(LESSON, key);
    else url.searchParams.delete(LESSON);
    url.hash = "";
    location.assign(url.toString());
}

export const play = (key) => opened(key);

export const lessons = () => opened("");

export const following = LESSONS[LESSONS.indexOf(scenario) + 1];
