from dataclasses import replace
from pathlib import Path
from core.base.file_access import FileAccess
from argparse import ArgumentParser, Namespace

from core.base.caller.caller import Caller
from engine.row.page import Page
from core.base.registry.skill_entry import SkillEntry
from core.base.subcommand.output import Output
from core.base.subcommand.read_subcommand import ReadSubcommand
from engine.types.type_guards import is_tuple
from core.modules.skills.support.skill_agent_groups import SkillAgentGroups
from core.modules.skills.support.skill_catalogue import SkillCatalogue


class SkillListSubcommand(ReadSubcommand[tuple[SkillEntry, ...]]):
    """`journal skill list`: every skill the modules declare, with its folder and description."""

    cli_name = "skill"
    name = "list"

    def __init__(self, catalogue: SkillCatalogue, groups: SkillAgentGroups) -> None:
        self.catalogue, self.groups = catalogue, groups

    def arguments(self, parser: ArgumentParser) -> None:
        return None

    def read(self, arguments: Namespace, caller: Caller) -> tuple[SkillEntry, ...]:
        groups = self.groups.labels()
        dated = (skill if skill.modified_at is not None else replace(skill, modified_at=FileAccess.shared().version(Path(skill.path)).modified_at) for skill in self.catalogue.skills())
        return tuple(replace(skill, groups=groups.get(skill.folder, ())) for skill in dated)

    def write_output(self, value: object, output: Output) -> None:
        skills = [skill for skill in value if isinstance(skill, SkillEntry)] if is_tuple(value) else []
        if output.json_output:
            output.page(Page(tuple(skills), 1, max(len(skills), 1), len(skills)))
            return
        for skill in skills:
            output.line(f"{skill.folder}  {skill.description}")
