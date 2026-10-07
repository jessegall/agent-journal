import PhoneDashboard from "./PhoneDashboard.vue";
import PhoneGuide from "./PhoneGuide.vue";
import PhoneLog from "./PhoneLog.vue";
import PhonePlugin from "./PhonePlugin.vue";
import PhonePluginConfigure from "./PhonePluginConfigure.vue";
import PhonePluginPage from "./PhonePluginPage.vue";
import PhonePlugins from "./PhonePlugins.vue";
import PhoneRegion from "./PhoneRegion.vue";
import PhoneService from "./PhoneService.vue";
import PhoneSettingGroup from "./PhoneSettingGroup.vue";
import PhoneSettings from "./PhoneSettings.vue";
import PhoneSkill from "./PhoneSkill.vue";
import PhoneSkills from "./PhoneSkills.vue";

export const SETTINGS_SCREENS = {
    settings: PhoneSettings,
    region: PhoneRegion,
    setting: PhoneSettingGroup,
    service: PhoneService,
    plugins: PhonePlugins,
    plugin: PhonePlugin,
    pluginsettings: PhonePluginConfigure,
    ppage: PhonePluginPage,
    dash: PhoneDashboard,
    guide: PhoneGuide,
    skills: PhoneSkills,
    skillview: PhoneSkill,
    log: PhoneLog,
};
