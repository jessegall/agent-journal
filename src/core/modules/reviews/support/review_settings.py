from core.modules.settings.bindings.support.setting_values import SettingValues

REVIEWER_SETTING = "reviews.reviewer"
REVIEWERS_MOST_SETTING = "reviews.reviewers-most"
PROGRAM_SETTING = "reviews.program"
MODEL_SETTING = "reviews.model"
DEFAULT_REVIEWERS_MOST = 1
DEFAULT_PROGRAM = "claude"


class ReviewSettings:
    """What the settings say about reviewers: whether they are on, how many may be out and which program and
    model they run."""

    def __init__(self, settings: SettingValues) -> None:
        self.settings = settings

    def enabled(self, environment_id: int) -> bool:
        return self.settings.value(REVIEWER_SETTING, environment_id, False) is True

    def limit(self, environment_id: int) -> int:
        value = self.settings.value(REVIEWERS_MOST_SETTING, environment_id, DEFAULT_REVIEWERS_MOST)
        return value if isinstance(value, int) and not isinstance(value, bool) else DEFAULT_REVIEWERS_MOST

    def program(self, environment_id: int) -> str:
        return self.settings.text(PROGRAM_SETTING, environment_id, DEFAULT_PROGRAM)

    def model(self, environment_id: int) -> str:
        return self.settings.text(MODEL_SETTING, environment_id, "")
