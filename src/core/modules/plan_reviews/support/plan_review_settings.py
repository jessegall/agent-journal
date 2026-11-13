from engine.enums.setting_type import SettingType
from engine.setting.setting_group import SettingGroup
from engine.setting.setting_value import SettingValue
from core.modules.plans.support.plan_settings import CHECKPOINTS_SECTION

MODULE_KEY = "journal.core.plan_reviews"
CHECKPOINTS_GROUP = f"{MODULE_KEY}.checkpoints"
QUICK_REVIEW_SETTING = f"{CHECKPOINTS_GROUP}.quick-review"
REVIEW_MODEL_SETTING = f"{CHECKPOINTS_GROUP}.review-model"
REVIEW_MODELS = ("sonnet", "equal")

PLAN_REVIEW_SETTINGS = [
    SettingGroup("checkpoints", "Checkpoint reviews", "Whether a reviewer reads each checkpoint of a plan, and on which model.", children=[
        SettingValue("quick-review", "Quick review at a checkpoint", "A reviewer agent reads what the phase changed and compares it with the plan before the plan goes on.",
                     SettingType.FLAG, default=False, person_set=True, screen="work", section=CHECKPOINTS_SECTION),
        SettingValue("review-model", "Review model", "Sonnet, or the equal model of the agent's own program; never the strongest model.",
                     SettingType.CHOICE, default=REVIEW_MODELS[0], choices=REVIEW_MODELS, person_set=True, required_settings=[QUICK_REVIEW_SETTING], screen="work", section=CHECKPOINTS_SECTION),
    ]),
]
