from engine.setting.setting_list import SettingList
from engine.enums.setting_scope import SettingScope
from engine.enums.setting_type import SettingType
from engine.setting.setting_value import SettingValue


class PhoneSettingValues(SettingList):
    """The settings of the phone module."""

    values = [SettingValue("push-private-key", "Push signing key", "The secret half of the key pair the journal signs phone notices with.", SettingType.TEXT,
                           secret=True, scope=SettingScope.PROJECT),
              SettingValue("push-public-key", "Push public key", "The public half of the key pair, which a phone subscribes to notices with.", SettingType.TEXT,
                           secret=True, scope=SettingScope.PROJECT)]
