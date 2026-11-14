from dataclasses import dataclass

from engine.setting.setting_values import SettingValues
from core.modules.settings.support.setting_reader import SettingReader, ENVIRONMENT_SOURCE
from core.modules.skills.support.start_skills import SESSION_START_KEY, AFTER_COMPACTION_KEY, MAIN_AGENT_KEY

SKILL_LIST_KEYS = (SESSION_START_KEY, AFTER_COMPACTION_KEY, MAIN_AGENT_KEY)


@dataclass(frozen=True)
class SkillRequirements:
    """Project skill lists and whether this environment replaces any of them."""

    session_start: tuple[str, ...]
    after_compaction: tuple[str, ...]
    main_agent: tuple[str, ...]
    environment_overrides: bool

    @classmethod
    def read(cls, reader: SettingReader, values: SettingValues) -> "SkillRequirements":
        project = values.project
        return cls(project.texts(SESSION_START_KEY), project.texts(AFTER_COMPACTION_KEY), project.texts(MAIN_AGENT_KEY),
                   any(reader.current(key).source == ENVIRONMENT_SOURCE for key in SKILL_LIST_KEYS))
