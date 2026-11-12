from engine.enums.setting_type import SettingType
from engine.setting.setting_group import SettingGroup
from engine.setting.setting_value import SettingValue

MODULE_KEY = "journal.core.plans"
CHECKPOINTS_GROUP = f"{MODULE_KEY}.checkpoints"
QUICK_REVIEW_SETTING = f"{CHECKPOINTS_GROUP}.quick-review"
REVIEW_MODEL_SETTING = f"{CHECKPOINTS_GROUP}.review-model"
CHECKPOINT_COMMAND_SETTING = f"{CHECKPOINTS_GROUP}.command"
WAIT_FOR_PERSON_SETTING = f"{CHECKPOINTS_GROUP}.wait-for-person"
REVIEW_MODELS = ("sonnet", "equal")
CHECKPOINTS_SECTION = "Checkpoints"

PLAN_SETTINGS = [
    SettingGroup("checkpoints", "Checkpoints", "What every checkpoint of a plan does by default; a plan or one checkpoint can say otherwise.", children=[
        SettingValue("quick-review", "Quick review at a checkpoint", "A reviewer agent reads what the phase changed and compares it with the plan before the plan goes on.",
                     SettingType.FLAG, default=False, person_set=True, screen="work", section=CHECKPOINTS_SECTION),
        SettingValue("review-model", "Review model", "Sonnet, or the equal model of the agent's own program; never the strongest model.",
                     SettingType.CHOICE, default=REVIEW_MODELS[0], choices=REVIEW_MODELS, person_set=True, required_settings=[QUICK_REVIEW_SETTING], screen="work", section=CHECKPOINTS_SECTION),
        SettingValue("command", "Command to run at a checkpoint", "A command such as the whole test suite or a build; the plan goes on only when it passes. Empty runs nothing.",
                     SettingType.TEXT, default="", person_set=True, screen="work", section=CHECKPOINTS_SECTION),
        SettingValue("wait-for-person", "Wait for the person at a checkpoint", "The agent working the plan stops at the checkpoint and goes on once a person approves it on the plan card.",
                     SettingType.FLAG, default=False, person_set=True, screen="work", section=CHECKPOINTS_SECTION),
    ]),
]
