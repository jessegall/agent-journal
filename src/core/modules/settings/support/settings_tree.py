from engine.setting.setting_group import SettingGroup
from engine.enums.setting_scope import SettingScope
from engine.enums.setting_type import SettingType
from engine.setting.setting_value import SettingValue

MODULE_KEY = "journal.core.settings"
GUARD_SETTINGS = f"{MODULE_KEY}.guard."
BACKUP_MINUTES_SETTING = "journal.core.settings.backup-minutes"
BACKUP_COUNT_SETTING = "journal.core.settings.backup-count"

SETTINGS_SETTINGS = [SettingValue("backup-minutes", "Copy the database every (minutes)", "How often the journal also copies its database to .journal/backups-watch; 0, the default, copies only before updates.",
                                  SettingType.NUMBER, default=0, scope=SettingScope.PROJECT),
                     SettingValue("backup-count", "Database copies to keep", "How many of the newest database copies stay in .journal/backups-watch; an update always makes one.",
                                  SettingType.NUMBER, default=3, scope=SettingScope.PROJECT),
                     SettingGroup("guard", "Guards and rules", "Guards and rules switched off for the whole project.",
                                  any_key=SettingValue("*", "On", "Whether this guard or rule is on.", SettingType.FLAG, default=True, scope=SettingScope.PROJECT, person_set=True))]
