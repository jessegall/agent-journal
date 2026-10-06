import PhoneKindList from "./PhoneKindList.vue";
import PhonePlaceSoon from "./PhonePlaceSoon.vue";
import PhoneSearch from "./PhoneSearch.vue";

import {SETTINGS_SCREENS} from "./settings/screens.js";

export const SCREENS = {list: PhoneKindList, place: PhonePlaceSoon, search: PhoneSearch, ...SETTINGS_SCREENS};

const kindOfRoute = (route) => route.split(":")[0];

export const screenOf = (route) => SCREENS[kindOfRoute(route)] || null;
export const targetOf = (route) => route.slice(kindOfRoute(route).length + 1);
