from core.base.setting.setting_type import SettingType
from core.base.setting.setting_value import SettingValue

MODULE_KEY = "journal.core.overview"
COMMANDS_KEY = f"{MODULE_KEY}.commands"
TASK_COLUMNS = "--columns id,title"
DEFAULT_COMMANDS = (f"task list --state started {TASK_COLUMNS}", f"task list --state blocked {TASK_COLUMNS}", f"task list --state open {TASK_COLUMNS}", "message unread", "question list")
OVERVIEW_SETTINGS = [SettingValue("commands", "Overview commands", "The commands journal overview runs, in this order, each under its own heading.", SettingType.LIST, default=DEFAULT_COMMANDS)]
