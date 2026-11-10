from engine.setting.setting_type import SettingType
from engine.setting.setting_value import SettingValue

MODULE_KEY = "journal.core.tasks"
QUIET_TASK_MINUTES = f"{MODULE_KEY}.quiet-task-minutes"
TASK_SETTINGS = [
    SettingValue("quiet-task-minutes", "Minutes before a task reminder", "Minutes an agent with a task in hand does nothing before it is told to carry on or say why the task waits.",
                 SettingType.NUMBER, default=15),
]
