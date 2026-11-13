from core.modules.skills.support.skill_catalogue import SkillCatalogue
from engine.setting.setting_values import SettingValues
from engine.enums.setting_type import SettingType
from engine.setting.setting_value import SettingValue

MODULE_KEY = "journal.core.skills"
SESSION_START_KEY = f"{MODULE_KEY}.session-start"
AFTER_COMPACTION_KEY = f"{MODULE_KEY}.after-compaction"
MAIN_AGENT_KEY = f"{MODULE_KEY}.main-agent"
JOURNAL_SKILLS = tuple(["journal"])
MAIN_AGENT_SKILLS = ("journal-etiquette", "journal-tasks", "journal-messages", "journal-memory", "journal-plans")
SKILL_SETTINGS = [
    SettingValue("session-start", "Skills at the start", "The skills an agent reads when its session starts.", SettingType.LIST, default=JOURNAL_SKILLS),
    SettingValue("after-compaction", "Skills after a compaction", "The skills an agent reads again after its context is compacted.",
                 SettingType.LIST, default=JOURNAL_SKILLS),
    SettingValue("main-agent", "Skills of a main agent", "The skills a main agent reads as well, at its start and after a compaction.", SettingType.LIST, default=MAIN_AGENT_SKILLS),
]


class StartSkills:
    """Reads start and compaction requirements, keeping skills still in the catalogue."""

    def __init__(self, values: SettingValues, catalogue: SkillCatalogue) -> None:
        self.values, self.catalogue = values, catalogue

    def session_start(self) -> list[str]:
        return [*self.folders(SESSION_START_KEY), *self.setting_skills()]

    def after_compaction(self) -> list[str]:
        return [*self.folders(AFTER_COMPACTION_KEY), *self.setting_skills()]

    def setting_skills(self) -> list[str]:
        return [skill.folder for skill in self.catalogue.skills() if skill.required_setting is not None and self.values.flag(skill.required_setting)]

    def main_agent(self) -> list[str]:
        return self.folders(MAIN_AGENT_KEY)

    def folders(self, key: str) -> list[str]:
        declared = {skill.folder for skill in self.catalogue.skills()}
        return [folder for folder in self.values.texts(key) if folder in declared]
