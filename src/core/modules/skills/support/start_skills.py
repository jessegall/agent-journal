from core.base.registry.registry import Registry
from core.modules.settings.bindings.support.setting_values import SettingValues
from core.base.setting.setting_type import SettingType
from core.base.setting.setting_value import SettingValue

MODULE_KEY = "journal.core.skills"
SESSION_START_KEY = f"{MODULE_KEY}.session-start"
AFTER_COMPACTION_KEY = f"{MODULE_KEY}.after-compaction"
JOURNAL_SKILLS = ("journal", "journal-etiquette", "journal-messages")
SKILL_SETTINGS = [
    SettingValue("session-start", "Skills at the start", "The skills an agent reads when its session starts.", SettingType.LIST, default=JOURNAL_SKILLS),
    SettingValue("after-compaction", "Skills after a compaction", "The skills an agent reads again after its context is compacted.",
                 SettingType.LIST, default=JOURNAL_SKILLS),
]


class StartSkills:
    """The skills made due when a session starts and when it starts again after a compaction, as the two settings
    name them for an environment, else for the project, else the journal's three, each only when a module declares it."""

    def __init__(self, values: SettingValues, registry: Registry) -> None:
        self.values, self.registry = values, registry

    def session_start(self, environment_id: int) -> list[str]:
        return self.folders(SESSION_START_KEY, environment_id)

    def after_compaction(self, environment_id: int) -> list[str]:
        return self.folders(AFTER_COMPACTION_KEY, environment_id)

    def folders(self, key: str, environment_id: int) -> list[str]:
        declared = {skill.folder for skill in self.registry.skills}
        return [folder for folder in self.values.texts(key, environment_id) if folder in declared]
