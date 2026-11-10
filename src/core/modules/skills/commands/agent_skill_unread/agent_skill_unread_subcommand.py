from argparse import ArgumentParser, Namespace

from engine.caller.caller import Caller
from core.base.subcommand.output import Output
from core.base.subcommand.read_subcommand import ReadSubcommand
from engine.types.type_guards import is_tuple
from core.modules.skills.support.unread_skills import UnreadSkills


class AgentSkillUnreadSubcommand(ReadSubcommand[tuple[str, ...]]):
    """`journal agent-skill unread <agent>`: the skills an agent has due, or read in an older text than the
    catalogue's now; a skill the catalogue no longer holds is left out."""

    cli_name = "agent-skill"
    name = "unread"

    def __init__(self, unread_skills: UnreadSkills) -> None:
        self.unread_skills = unread_skills

    def arguments(self, parser: ArgumentParser) -> None:
        parser.add_argument("agent_id", type=int)

    def read(self, arguments: Namespace, caller: Caller) -> tuple[str, ...]:
        return tuple(self.unread_skills.unread(arguments.agent_id))

    def write_output(self, value: object, output: Output) -> None:
        for folder in value if is_tuple(value) else ():
            output.line(str(folder))
