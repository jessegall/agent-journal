import PhoneKindList from "./PhoneKindList.vue";
import PhonePlaceSoon from "./PhonePlaceSoon.vue";
import PhoneSearch from "./PhoneSearch.vue";

export const SCREENS = {list: PhoneKindList, place: PhonePlaceSoon, search: PhoneSearch};

const kindOfRoute = (route) => route.split(":")[0];

export const screenOf = (route) => SCREENS[kindOfRoute(route)] || null;
export const targetOf = (route) => route.slice(kindOfRoute(route).length + 1);
