export const SCENARIOS = [
    {key: "bakery", label: "A bakery website", short: "Bakery", load: () => import("./scenarios/bakery.json")},
    {key: "helpers", label: "Helpers beside Claude", short: "Helpers", load: () => import("./scenarios/helpers.json")},
    {key: "phone", label: "From the phone", short: "Phone", load: () => import("./scenarios/phone.json")},
];

const asked = new URLSearchParams(location.search).get("scenario");

export const SHORT = SCENARIOS.map(({key, short}) => ({key, label: short}));

export const scenario = SCENARIOS.find((one) => one.key === asked) || SCENARIOS[0];

export function play(key) {
    const url = new URL(location.href);
    url.searchParams.set("scenario", key);
    location.assign(url.toString());
}
