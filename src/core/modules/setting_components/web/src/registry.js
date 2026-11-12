import SettingChoiceField from "./SettingChoiceField.vue";
import SettingEntryList from "./SettingEntryList.vue";
import SettingKeyedCapTable from "./SettingKeyedCapTable.vue";
import SettingNumberField from "./SettingNumberField.vue";
import SettingNumberList from "./SettingNumberList.vue";
import SettingPerTypeOverrideRow from "./SettingPerTypeOverrideRow.vue";
import SettingTextField from "./SettingTextField.vue";
import SettingThreeWayCap from "./SettingThreeWayCap.vue";
import SettingToggle from "./SettingToggle.vue";

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

export function resolveSettingComponent(name) {
    if (!Object.hasOwn(settingComponents, name)) throw new Error(`no setting component is named "${name}"`);
    return settingComponents[name];
}
