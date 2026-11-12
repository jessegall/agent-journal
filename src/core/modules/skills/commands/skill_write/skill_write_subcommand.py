from argparse import ArgumentParser, Namespace

from engine.caller.caller import Caller
from engine.registry.registry import Registry
from engine.subcommand.read_subcommand import ReadSubcommand
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
        results = [f"{'written' if changed else 'unchanged'}: {folder}" for folder, changed in self.files.write_all(self.registry.skills).items()]
        return (*results, *(f"removed: {folder}" for folder in self.files.clear(self.registry.skills)))
