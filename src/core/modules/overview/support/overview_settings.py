from engine.enums.setting_type import SettingType
from engine.setting.setting_value import SettingValue

MODULE_KEY = "journal.core.overview"
COMMANDS_KEY = f"{MODULE_KEY}.commands"
TASK_COLUMNS = "--columns id,title,complexity"
DEFAULT_COMMANDS = ("skill required", "rule list --state active --columns id,text", f"task list --state started {TASK_COLUMNS},assigned_to", f"task list --state testing {TASK_COLUMNS}", f"task list --state blocked {TASK_COLUMNS}", f"task list --state open {TASK_COLUMNS}", "plan list --state started --columns id,title", "memory list --state active", "message conversations", "usage own-messages", "plugin changes --since HEAD", "process list --state running --columns id,line", "process list --limit 5 --columns id,state,exit_code,line", "message unread", "message reports", "question list")
OVERVIEW_SETTINGS = [SettingValue("commands", "Overview commands", "Commands shown in the overview, in order, each under a separate heading.", SettingType.LIST, default=DEFAULT_COMMANDS)]
