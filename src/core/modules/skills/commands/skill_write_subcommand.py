from argparse import ArgumentParser, Namespace

from core.base.caller.caller import Caller
from core.base.registry.registry import Registry
from core.base.subcommand.output import Output
from core.base.subcommand.read_subcommand import ReadSubcommand
from core.modules.skills.support.skill_files import SkillFiles


class SkillWriteSubcommand(ReadSubcommand[tuple[str, ...]]):
    """`journal skill write`: puts every skill's text into the skill folders of the agent programs, rewrites
    only a changed file and clears the journal's own folders no module declares. It writes files outside the
    database."""

    cli_name = "skill"
    name = "write"

    def __init__(self, registry: Registry, files: SkillFiles) -> None:
        self.registry, self.files = registry, files

    def arguments(self, parser: ArgumentParser) -> None:
        return None

    def read(self, arguments: Namespace, caller: Caller) -> tuple[str, ...]:
        results = [f"{'written' if self.files.write(skill) else 'unchanged'}: {skill.folder}" for skill in self.registry.skills]
        return (*results, *(f"removed: {folder}" for folder in self.files.clear(self.registry.skills)))

    def write_output(self, value: object, output: Output) -> None:
        for line in value if isinstance(value, tuple) else ():
            output.line(str(line))
