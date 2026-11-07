from argparse import ArgumentParser, Namespace

from core.base.caller.caller import Caller
from core.base.query.queries import Queries
from core.modules.agents.models.agent import Agent
from core.base.subcommand.subcommand import Subcommand
from core.modules.skills.commands.require_skill.require_skill import RequireSkill
from core.modules.skills.models.agent_skill import AgentSkill
from core.modules.skills.models.enums.agent_skill_state import AgentSkillState
from core.modules.skills.support.skill_files import SkillFiles
from core.base.subcommand.output import Output


class RequireSkillSubcommand(Subcommand[RequireSkill, AgentSkill]):
    """`journal skill require <agent> <skill>`: makes a skill due for an agent."""

    cli_name = "skill"
    name = "require"
    outward = True

    def __init__(self, files: SkillFiles, queries: Queries) -> None:
        self.files, self.queries = files, queries

    def arguments(self, parser: ArgumentParser) -> None:
        parser.add_argument("agent_id", type=int)
        parser.add_argument("skill")

    def command(self, arguments: Namespace, caller: Caller) -> RequireSkill:
        return RequireSkill(arguments.agent_id, arguments.skill)

    def write_output(self, value: object, output: Output) -> None:
        if not isinstance(value, AgentSkill):
            return
        text = f"loaded: {value.skill}" if value.state is AgentSkillState.LOADED else self.files.agent_instruction(value.skill, self.queries.query(Agent).find(value.session_agent_id))
        output.write(text, output.values(value))
