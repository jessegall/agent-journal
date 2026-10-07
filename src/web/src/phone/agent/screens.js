import PhoneActivity from "./PhoneActivity.vue";
import PhoneAgentChoice from "./PhoneAgentChoice.vue";
import PhoneAgentSkills from "./PhoneAgentSkills.vue";
import PhoneAppoint from "./PhoneAppoint.vue";
import PhoneLoops from "./PhoneLoops.vue";
import PhoneTerminal from "./PhoneTerminal.vue";

export const AGENT_SCREENS = {
    activity: PhoneActivity,
    agentcontrol: PhoneAgentChoice,
    agentskills: PhoneAgentSkills,
    appoint: PhoneAppoint,
    loops: PhoneLoops,
    terminal: PhoneTerminal,
};
