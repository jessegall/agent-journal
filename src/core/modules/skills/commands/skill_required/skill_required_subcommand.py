from argparse import ArgumentParser, Namespace

from core.base.caller.caller import Caller
from core.base.subcommand.output import Output
from core.base.subcommand.read_subcommand import ReadSubcommand
from core.base.type_guards import is_tuple
from core.modules.skills.support.skill_files import SkillFiles
from core.modules.skills.support.unread_skills import UnreadSkills

NONE_LINE = "no skills to load"


class SkillRequiredSubcommand(ReadSubcommand[tuple[str, ...]]):
    """`journal skill required`: the skills the calling agent must still load, each with the path of its file."""

    cli_name = "skill"
    name = "required"

    def __init__(self, unread_skills: UnreadSkills, files: SkillFiles) -> None:
        self.unread_skills, self.files = unread_skills, files

    def arguments(self, parser: ArgumentParser) -> None:
        return None

    def read(self, arguments: Namespace, caller: Caller) -> tuple[str, ...]:
        agent_id = caller.read_actor_id
        if agent_id is None:
            return ()
        return tuple(f"{name}: {path}" for name, path in self.files.readable_paths(self.unread_skills.names(agent_id)).items())

    def write_output(self, value: object, output: Output) -> None:
        lines = [str(line) for line in value] if is_tuple(value) else []
        output.line("\n".join(lines) or NONE_LINE)
