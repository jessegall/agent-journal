from dataclasses import dataclass

from core.modules.settings.support.setting_reader import SettingReader, ENVIRONMENT_SOURCE
from core.modules.skills.support.start_skills import SESSION_START_KEY, AFTER_COMPACTION_KEY, MAIN_AGENT_KEY

SKILL_LIST_KEYS = (SESSION_START_KEY, AFTER_COMPACTION_KEY, MAIN_AGENT_KEY)


@dataclass(frozen=True)
class SkillRequirements:
    """Project skill lists and whether this environment replaces any of them."""

    session_start: object
    after_compaction: object
    main_agent: object
    environment_overrides: bool

    @classmethod
    def read(cls, reader: SettingReader) -> "SkillRequirements":
        return cls(*(reader.project(key).value for key in SKILL_LIST_KEYS),
                   any(reader.current(key).source == ENVIRONMENT_SOURCE for key in SKILL_LIST_KEYS))
