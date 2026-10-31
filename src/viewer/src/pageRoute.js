// which page the address asks for and what it is given: no environment, the page that finds one; ?view= one window of a
// float, ?agent= an agent's page, ?windows= a fixed row of windows, else the home page
export function pageRoute(search) {
    const query = new URLSearchParams(search);
    const environment = query.get("environment");
    if (!environment) return {page: "environment", props: {search}};
    if (query.get("view")) return {page: "view", props: {environment, view: query.get("view"), float: Number(query.get("float")) || 0}};
    if (query.get("agent")) return {page: "agent", props: {environment, agent: Number(query.get("agent"))}};
    if (query.get("windows")) return {page: "shell", props: {environment, layout: query.get("windows").split(",")}};
    return {page: "home", props: {environment}};
}
