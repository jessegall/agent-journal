from engine.enums.setting_type import SettingType
from engine.setting.setting_group import SettingGroup
from engine.setting.setting_value import SettingValue

MODULE_KEY = "journal.core.plans"
CHECKPOINTS_GROUP = f"{MODULE_KEY}.checkpoints"
CHECKPOINT_COMMAND_SETTING = f"{CHECKPOINTS_GROUP}.command"
CHECKPOINTS_SECTION = "Checkpoints"
MAIN_AGENT_APPROVAL_SETTING = f"{MODULE_KEY}.main-agent-approves-plans"

PLAN_SETTINGS = [
    SettingValue("main-agent-approves-plans", "Main agent approves plans", "The main agent approves a plan itself, with its reason, and no user presses Approve.",
                 SettingType.FLAG, default=False, person_set=True),
    SettingGroup("checkpoints", "Checkpoints", "What every checkpoint of a plan does by default; a plan or one checkpoint can say otherwise.", children=[
        SettingValue("command", "Command to run at a checkpoint", "A command such as the whole test suite or a build; the plan goes on only when it passes. Empty runs nothing.",
                     SettingType.TEXT, default="", person_set=True, screen="work", section=CHECKPOINTS_SECTION),
    ]),
]
