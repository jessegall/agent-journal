from core.base.registry.registry import Registry
from core.modules.settings.bindings.support.setting_values import SettingValues
from core.base.setting.setting_type import SettingType
from core.base.setting.setting_value import SettingValue

MODULE_KEY = "journal.core.skills"
SESSION_START_KEY = f"{MODULE_KEY}.session-start"
AFTER_COMPACTION_KEY = f"{MODULE_KEY}.after-compaction"
MAIN_AGENT_KEY = f"{MODULE_KEY}.main-agent"
JOURNAL_SKILLS = ("journal", "journal-etiquette")
MAIN_AGENT_SKILLS = ("journal-tasks", "journal-messages", "journal-memory", "journal-plans")
SKILL_SETTINGS = [
    SettingValue("session-start", "Skills at the start", "The skills an agent reads when its session starts.", SettingType.LIST, default=JOURNAL_SKILLS),
    SettingValue("after-compaction", "Skills after a compaction", "The skills an agent reads again after its context is compacted.",
                 SettingType.LIST, default=JOURNAL_SKILLS),
    SettingValue("main-agent", "Skills of a main agent", "The skills a main agent reads as well, at its start and after a compaction.", SettingType.LIST, default=MAIN_AGENT_SKILLS),
]


class StartSkills:
    """The skills made due when a session starts and when it starts again after a compaction, as the two
    settings name them for an environment, else for the project, else the journal's own, each only when a
    module declares it."""

    def __init__(self, values: SettingValues, registry: Registry) -> None:
        self.values, self.registry = values, registry

    def session_start(self) -> list[str]:
        return self.folders(SESSION_START_KEY)

    def after_compaction(self) -> list[str]:
        return self.folders(AFTER_COMPACTION_KEY)

    def main_agent(self) -> list[str]:
        return self.folders(MAIN_AGENT_KEY)

    def folders(self, key: str) -> list[str]:
        declared = {skill.folder for skill in self.registry.skills}
        return [folder for folder in self.values.texts(key) if folder in declared]
