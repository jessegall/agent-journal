from engine.enums.setting_type import SettingType
from engine.setting.setting_group import SettingGroup
from engine.setting.setting_value import SettingValue

MODULE_KEY = "journal.core.plans"
CHECKPOINTS_GROUP = f"{MODULE_KEY}.checkpoints"
CHECKPOINT_COMMAND_SETTING = f"{CHECKPOINTS_GROUP}.command"
WAIT_FOR_PERSON_SETTING = f"{CHECKPOINTS_GROUP}.wait-for-person"
CHECKPOINTS_SECTION = "Checkpoints"

PLAN_SETTINGS = [
    SettingGroup("checkpoints", "Checkpoints", "What every checkpoint of a plan does by default; a plan or one checkpoint can say otherwise.", children=[
        SettingValue("command", "Command to run at a checkpoint", "A command such as the whole test suite or a build; the plan goes on only when it passes. Empty runs nothing.",
                     SettingType.TEXT, default="", person_set=True, screen="work", section=CHECKPOINTS_SECTION),
        SettingValue("wait-for-person", "Wait for the user at a checkpoint", "The agent working the plan stops at the checkpoint and goes on once a user approves it on the plan card.",
                     SettingType.FLAG, default=False, person_set=True, screen="work", section=CHECKPOINTS_SECTION),
    ]),
]
