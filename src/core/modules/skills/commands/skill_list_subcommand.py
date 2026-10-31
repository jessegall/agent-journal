from argparse import ArgumentParser, Namespace

from core.base.caller.caller import Caller
from core.base.page import Page
from core.base.registry.registry import Registry
from core.base.registry.skill_entry import SkillEntry
from core.base.subcommand.output import Output
from core.base.subcommand.read_subcommand import ReadSubcommand
from core.base.type_guards import is_tuple


class SkillListSubcommand(ReadSubcommand[tuple[SkillEntry, ...]]):
    """`journal skill list`: every skill the modules declare, with its folder and description."""

    cli_name = "skill"
    name = "list"

    def __init__(self, registry: Registry) -> None:
        self.registry = registry

    def arguments(self, parser: ArgumentParser) -> None:
        return None

    def read(self, arguments: Namespace, caller: Caller) -> tuple[SkillEntry, ...]:
        return self.registry.skills

    def write_output(self, value: object, output: Output) -> None:
        skills = [skill for skill in value if isinstance(skill, SkillEntry)] if is_tuple(value) else []
        if output.json_output:
            output.page(Page(tuple(skills), 1, max(len(skills), 1), len(skills)))
            return
        for skill in skills:
            output.line(f"{skill.folder}  {skill.description}")
