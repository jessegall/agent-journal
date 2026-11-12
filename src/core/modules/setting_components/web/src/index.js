import ChangeFoot from "./ChangeFoot.vue";
import SettingBackPath from "./SettingBackPath.vue";
import SettingBanner from "./SettingBanner.vue";
import SettingChoiceField from "./SettingChoiceField.vue";
import SettingEmptyState from "./SettingEmptyState.vue";
import SettingEntryList from "./SettingEntryList.vue";
import SettingHelperTypeTable from "./SettingHelperTypeTable.vue";
import SettingKeyedCapTable from "./SettingKeyedCapTable.vue";
import SettingNestedGroup from "./SettingNestedGroup.vue";
import SettingNumberField from "./SettingNumberField.vue";
import SettingNumberList from "./SettingNumberList.vue";
import SettingPerTypeOverrideRow from "./SettingPerTypeOverrideRow.vue";
import SettingPresetBand from "./SettingPresetBand.vue";
import SettingPresetCard from "./SettingPresetCard.vue";
import SettingPresetCompareTable from "./SettingPresetCompareTable.vue";
import SettingRow from "./SettingRow.vue";
import SettingSection from "./SettingSection.vue";
import SettingSectionList from "./SettingSectionList.vue";
import SettingSegments from "./SettingSegments.vue";
import SettingTextField from "./SettingTextField.vue";
import SettingThreeWayCap from "./SettingThreeWayCap.vue";
import SettingToggle from "./SettingToggle.vue";
import SettingsScreen from "./SettingsScreen.vue";
import SettingUsageBar from "./SettingUsageBar.vue";

export {CUSTOM_PRESET, currentPreset} from "./currentPreset.js";
export {itemsOfLines, listItems, listLines, sentList, shownList} from "./listText.js";
export {CHANGED_WORD, SOURCE_WORDS} from "./sourceWords.js";
export {numberRuleProblem, ruleOf} from "./numberRule.js";
export {useSettingsDraft} from "./useSettingsDraft.js";
export {filledPercent, isFull, overPercent} from "./usageFull.js";

export {resolveSettingComponent, settingComponents} from "./registry.js";
export {componentNameOf, hasComponent, sectionKeyOf, sectionsOf} from "./sections.js";

// the pieces around the settings, which no setting names
export {
    ChangeFoot,
    SettingBackPath,
    SettingBanner,
    SettingChoiceField,
    SettingEmptyState,
    SettingEntryList,
    SettingHelperTypeTable,
    SettingKeyedCapTable,
    SettingNestedGroup,
    SettingNumberField,
    SettingNumberList,
    SettingPerTypeOverrideRow,
    SettingPresetBand,
    SettingPresetCard,
    SettingPresetCompareTable,
    SettingRow,
    SettingSection,
    SettingSectionList,
    SettingSegments,
    SettingTextField,
    SettingThreeWayCap,
    SettingToggle,
    SettingUsageBar,
    SettingsScreen,
};
