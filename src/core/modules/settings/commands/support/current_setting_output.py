from core.base.subcommand.output import Output
from core.modules.settings.support.current_setting import CurrentSetting
from core.modules.settings.support.setting_lines import SettingLines


class CurrentSettingOutput:
    """The output of a setting command that answers one setting as it is now: its key, value and source."""

    def write_output(self, value: object, output: Output) -> None:
        if isinstance(value, CurrentSetting):
            SettingLines().write(value, output)
