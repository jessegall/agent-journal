export const SCENARIOS = [
    {key: "bakery", label: "A bakery website", load: () => import("./scenarios/bakery.json")},
    {key: "helpers", label: "Helpers beside Claude", load: () => import("./scenarios/helpers.json")},
];

const asked = new URLSearchParams(location.search).get("scenario");

export const scenario = SCENARIOS.find((one) => one.key === asked) || SCENARIOS[0];

export function play(key) {
    const url = new URL(location.href);
    url.searchParams.set("scenario", key);
    location.assign(url.toString());
}
