from core.base.type_guards import is_list
from core.modules.settings.bindings.support.setting_values import SettingValues

SESSION_START_KEY = "skills.session-start"
AFTER_COMPACTION_KEY = "skills.after-compaction"
DEFAULT_SKILLS = ["journal", "journal-etiquette", "journal-messages"]


class StartSkills:
    """The skills made due when a session starts and when it starts again after a compaction, as the two settings
    name them for an environment, else for the project, else the journal's three."""

    def __init__(self, values: SettingValues) -> None:
        self.values = values

    def session_start(self, environment_id: int) -> list[str]:
        return self.folders(SESSION_START_KEY, environment_id)

    def after_compaction(self, environment_id: int) -> list[str]:
        return self.folders(AFTER_COMPACTION_KEY, environment_id)

    def folders(self, key: str, environment_id: int) -> list[str]:
        value = self.values.value(key, environment_id, DEFAULT_SKILLS)
        return [str(folder) for folder in value] if is_list(value) else DEFAULT_SKILLS
