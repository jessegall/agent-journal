import {reactive} from "vue";

export const PAGES = [
    {key: "home", title: "Home"},
    {key: "tasks", title: "Tasks"},
    {key: "plans", title: "Plans"},
    {key: "memory", title: "Memory"},
    {key: "timeline", title: "Timeline"},
    {key: "settings", title: "Settings"},
];

export const route = reactive({env: "main", page: "home"});

function read() {
    const [env = "main", page = "home"] = window.location.hash.replace(/^#\/?/, "").split("/");
    route.env = decodeURIComponent(env) || "main";
    route.page = PAGES.some((p) => p.key === page) ? page : "home";
}

export const href = (env, page = "home") => `#/${encodeURIComponent(env)}/${page}`;

window.addEventListener("hashchange", read);
read();
