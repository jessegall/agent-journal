from collections.abc import Mapping

from engine.setting.setting_value import SettingDefault

StoredValue = str | int | float | bool | list[object] | Mapping[str, object] | None
CurrentValue = StoredValue | SettingDefault
