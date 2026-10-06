import PhoneKindList from "./PhoneKindList.vue";
import PhonePlaceSoon from "./PhonePlaceSoon.vue";
import PhoneSearch from "./PhoneSearch.vue";
import PhoneAttachedFiles from "./places/PhoneAttachedFiles.vue";
import PhoneEnvironments from "./places/PhoneEnvironments.vue";
import PhoneJournals from "./places/PhoneJournals.vue";
import PhoneOrganization from "./places/PhoneOrganization.vue";
import PhoneProjectFile from "./places/PhoneProjectFile.vue";
import PhoneProjectFiles from "./places/PhoneProjectFiles.vue";
import PhoneTimeline from "./PhoneTimeline.vue";

import {SETTINGS_SCREENS} from "./settings/screens.js";

export const SCREENS = {
    list: PhoneKindList,
    place: PhonePlaceSoon,
    search: PhoneSearch,
    organization: PhoneOrganization,
    journals: PhoneJournals,
    environments: PhoneEnvironments,
    files: PhoneProjectFiles,
    file: PhoneProjectFile,
    attached: PhoneAttachedFiles,
    timeline: PhoneTimeline,
    ...SETTINGS_SCREENS,
};

const kindOfRoute = (route) => route.split(":")[0];

export const screenOf = (route) => SCREENS[kindOfRoute(route)] || null;
export const targetOf = (route) => route.slice(kindOfRoute(route).length + 1);
