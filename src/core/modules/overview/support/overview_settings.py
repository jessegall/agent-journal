from core.base.setting.setting_type import SettingType
from core.base.setting.setting_value import SettingValue

MODULE_KEY = "journal.core.overview"
COMMANDS_KEY = f"{MODULE_KEY}.commands"
DEFAULT_COMMANDS = ("task list --state started", "task list --state blocked", "task list --state open", "message unread", "question list", "required-command list")
OVERVIEW_SETTINGS = [SettingValue("commands", "Overview commands", "The commands journal overview runs, in this order, each under its own heading.", SettingType.LIST, default=DEFAULT_COMMANDS)]
