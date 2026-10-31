from core.base.registry.setting_entry import GROUP_TYPE
from core.base.subcommand.output import Output
from core.base.type_guards import is_list, is_tuple
from core.modules.settings.support.current_setting import CurrentSetting

SET = "set"
UNSET_LABEL = "not set"


class SettingLines:
    """Prints a setting as read: its key, its value (a secret only as set or not set, a group as on or off) and
    where the value came from."""

    def write(self, setting: CurrentSetting, output: Output) -> None:
        output.line(f"key: {setting.entry.key}\nvalue: {self.shown(setting)}\nfrom: {setting.source}")

    @staticmethod
    def shown(setting: CurrentSetting) -> str:
        if setting.value is False and (setting.entry.type == GROUP_TYPE or setting.source.startswith("group ")):
            return "off"
        if setting.entry.type == GROUP_TYPE:
            return "on"
        if setting.entry.secret:
            return UNSET_LABEL if setting.value is None else SET
        if setting.value is None:
            return UNSET_LABEL
        if is_tuple(setting.value) or is_list(setting.value):
            return ", ".join(str(item) for item in setting.value)
        return str(setting.value)
