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
import SettingUsageBar from "./SettingUsageBar.vue";

export {CUSTOM_PRESET, currentPreset} from "./currentPreset.js";
export {itemsOfLines, listItems, listLines, sentList, shownList} from "./listText.js";
export {CHANGED_WORD, SOURCE_WORDS} from "./sourceWords.js";
export {filledPercent, isFull, overPercent} from "./usageFull.js";

// the setting components a settings screen draws a setting with: one entry for each value of the SettingComponent enum
// (src/engine/enums/setting_component.py), found by that value
export const settingComponents = Object.freeze({
    "toggle": SettingToggle,
    "number": SettingNumberField,
    "choice": SettingChoiceField,
    "entry-list": SettingEntryList,
    "number-list": SettingNumberList,
    "text": SettingTextField,
    "keyed-cap-table": SettingKeyedCapTable,
    "three-way-cap": SettingThreeWayCap,
    "per-type-override": SettingPerTypeOverrideRow,
});

// the pieces around the settings, which no setting names
export {
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
};

export function resolveSettingComponent(name) {
    if (!Object.hasOwn(settingComponents, name)) throw new Error(`no setting component is named "${name}"`);
    return settingComponents[name];
}
