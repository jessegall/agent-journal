from argparse import ArgumentParser, Namespace

from core.base.caller.caller import Caller
from core.base.subcommand.subcommand import Subcommand
from core.modules.skills.commands.require_skill import RequireSkill
from core.modules.skills.models.agent_skill import AgentSkill


class RequireSkillSubcommand(Subcommand[RequireSkill, AgentSkill]):
    """`journal skill require <agent> <skill>`: makes a skill due for an agent."""

    cli_name = "skill"
    name = "require"

    def arguments(self, parser: ArgumentParser) -> None:
        parser.add_argument("agent_id", type=int)
        parser.add_argument("skill")

    def command(self, arguments: Namespace, caller: Caller) -> RequireSkill:
        return RequireSkill(arguments.agent_id, arguments.skill)
