from core.base.module.module import Module
from core.base.setting.setting_type import SettingType
from core.base.setting.setting_value import SettingValue


class SampleNotesModule(Module):
    """A module sample that declares its settings."""

    name = "journal.core.sample_notes"
    settings = [
        SettingValue("limit", "Note limit", "How many notes the window lists.", SettingType.NUMBER, default=20),
        SettingValue("depth", "Depth",
                     # @sin naming_PlainSettingTextDetector
                     "How deep the notes ride before the engine keeps them.", SettingType.NUMBER, default=3),
        # @sin architecture_settings_SecretWithDefaultDetector
        SettingValue("token", "Token", "The token of the notes service.", SettingType.TEXT, default="abc", secret=True),
        SettingValue("password", "Password", "The password of the notes service.", SettingType.TEXT, secret=True),
    ]
