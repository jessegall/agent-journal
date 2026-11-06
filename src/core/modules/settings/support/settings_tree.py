from core.base.setting.setting_group import SettingGroup
from core.base.setting.setting_scope import SettingScope
from core.base.setting.setting_type import SettingType
from core.base.setting.setting_value import SettingValue

MODULE_KEY = "journal.core.settings"
GUARD_SETTINGS = f"{MODULE_KEY}.guard."
BACKUP_MINUTES_SETTING = "journal.core.settings.backup-minutes"
BACKUP_COUNT_SETTING = "journal.core.settings.backup-count"

SETTINGS_SETTINGS = [SettingValue("backup-minutes", "Copy the database every (minutes)", "How often the journal writes a copy of its database to .journal/backups-watch; 0 writes none.",
                                  SettingType.NUMBER, default=15, scope=SettingScope.PROJECT),
                     SettingValue("backup-count", "Database copies to keep", "How many of the newest database copies stay in .journal/backups-watch.",
                                  SettingType.NUMBER, default=2, scope=SettingScope.PROJECT),
                     SettingGroup("guard", "Guards and rules", "Guards and rules switched off for the whole project.",
                                  any_key=SettingValue("*", "On", "Whether this guard or rule is on.", SettingType.FLAG, default=True, scope=SettingScope.PROJECT, person_set=True))]
