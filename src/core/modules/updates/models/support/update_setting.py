from enum import Enum

from core.base.setting.setting_scope import SettingScope
from core.base.setting.setting_type import SettingType
from core.base.setting.setting_value import SettingValue


MODULE_KEY = "journal.core.updates"


class UpdateSetting(Enum):
    """A setting of the updates module, declared once: its full key and its default come from its declaration.
    """

    RELEASE_ADDRESS = SettingValue("release-address", "Release address", "Where the newest release is downloaded from, as install.sh does.",
                                   SettingType.TEXT, default="https://github.com/jessegall/agent-journal/releases/latest/download", scope=SettingScope.PROJECT)

    @property
    def key(self) -> str:
        return f"{MODULE_KEY}.{self.value.key}"


UPDATE_SETTINGS = [setting.value for setting in UpdateSetting]
