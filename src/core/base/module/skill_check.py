from collections.abc import Sequence

from core.base.change.event_pattern import EventPattern
from core.base.module.module import Module
from core.base.module.name_groups import NameGroups
from core.base.skill.skill_declaration import SKILLS_FOLDER

FOLDER_PREFIX = "journal"


class SkillCheck:
    """Checks the skills the modules declare before a sync writes anything: each folder is used once and starts
    with journal, its file is in the module's skills folder, and each event it names is raised by a model."""

    def problems(self, modules: Sequence[type[Module]], events: Sequence[str]) -> tuple[str, ...]:
        problems = list(NameGroups.duplicates([("skills", [skill.folder for module in modules for skill in module.skills])]))
        for module in modules:
            for skill in module.skills:
                name = f"the skill {skill.folder}"
                if not skill.folder.startswith(FOLDER_PREFIX):
                    problems.append(f"{name} does not start with {FOLDER_PREFIX}")
                if not (module.folder() / SKILLS_FOLDER / skill.folder / skill.file).exists():
                    problems.append(f"{name} has no {skill.file} in its module's {SKILLS_FOLDER} folder")
                problems += [f"{name} names {event}, which no model's events match" for event in skill.events
                             if not any(EventPattern(event).matches(raised) for raised in events)]
        return tuple(problems)
