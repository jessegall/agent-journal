import PhoneCommit from "./PhoneCommit.vue";
import PhoneDump from "./PhoneDump.vue";
import PhoneKindList from "./PhoneKindList.vue";
import PhoneSearch from "./PhoneSearch.vue";
import PhoneAttachedFiles from "./places/PhoneAttachedFiles.vue";
import PhoneEnvironments from "./places/PhoneEnvironments.vue";
import PhoneJournals from "./places/PhoneJournals.vue";
import PhoneOrganization from "./places/PhoneOrganization.vue";
import PhoneProjectFile from "./places/PhoneProjectFile.vue";
import PhoneProjectFiles from "./places/PhoneProjectFiles.vue";
import PhoneTerminal from "./PhoneTerminal.vue";
import PhoneTimeline from "./PhoneTimeline.vue";

import {AGENT_SCREENS} from "./agent/screens.js";
import {SETTINGS_SCREENS} from "./settings/screens.js";

export const SCREENS = {
    list: PhoneKindList,
    search: PhoneSearch,
    organization: PhoneOrganization,
    journals: PhoneJournals,
    environments: PhoneEnvironments,
    files: PhoneProjectFiles,
    file: PhoneProjectFile,
    attached: PhoneAttachedFiles,
    timeline: PhoneTimeline,
    terminal: PhoneTerminal,
    commit: PhoneCommit,
    dump: PhoneDump,
    ...SETTINGS_SCREENS,
    ...AGENT_SCREENS,
};

const kindOfRoute = (route) => route.split(":")[0];

export const screenOf = (route) => SCREENS[kindOfRoute(route)] || null;
export const targetOf = (route) => route.slice(kindOfRoute(route).length + 1);
