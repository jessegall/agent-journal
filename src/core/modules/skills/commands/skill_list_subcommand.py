from argparse import ArgumentParser, Namespace

from core.base.caller.caller import Caller
from core.base.registry.registry import Registry
from core.base.registry.skill_entry import SkillEntry
from core.base.subcommand.output import Output
from core.base.subcommand.read_subcommand import ReadSubcommand


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
        for skill in value if isinstance(value, tuple) else ():
            if isinstance(skill, SkillEntry):
                output.line(f"{skill.folder}  {skill.description}")
