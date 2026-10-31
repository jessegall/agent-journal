from core.base.setting.setting_type import SettingType
from core.base.setting.setting_value import SettingValue
from core.modules.settings.bindings.support.setting_values import SettingValues

MODULE_KEY = "journal.core.reviews"
REVIEWER_SETTING = f"{MODULE_KEY}.reviewer"
REVIEWERS_MOST_SETTING = f"{MODULE_KEY}.reviewers-most"
PROGRAM_SETTING = f"{MODULE_KEY}.program"
MODEL_SETTING = f"{MODULE_KEY}.model"
REVIEW_SETTINGS = [
    SettingValue("reviewer", "Reviewers", "Whether finished work is reviewed by a reviewer before it is merged.", SettingType.FLAG, default=False),
    SettingValue("reviewers-most", "Reviewers at once", "How many reviewers may work at the same time.", SettingType.NUMBER, default=1),
    SettingValue("program", "Reviewer program", "The agent program a reviewer runs in.", SettingType.TEXT, default="claude"),
    SettingValue("model", "Reviewer model", "The model a reviewer uses; empty uses the program's own.", SettingType.TEXT, default=""),
]


class ReviewSettings:
    """What the settings say about reviewers: whether they are on, how many may be out and which program and
    model they run."""

    def __init__(self, settings: SettingValues) -> None:
        self.settings = settings

    def enabled(self, environment_id: int) -> bool:
        return self.settings.flag(REVIEWER_SETTING, environment_id)

    def limit(self, environment_id: int) -> int:
        return self.settings.number(REVIEWERS_MOST_SETTING, environment_id)

    def program(self, environment_id: int) -> str:
        return self.settings.text(PROGRAM_SETTING, environment_id)

    def model(self, environment_id: int) -> str:
        return self.settings.text(MODEL_SETTING, environment_id)
