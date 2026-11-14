from engine.cli.agent_number import AgentNumber
from argparse import ArgumentParser, Namespace

from engine.caller.caller import Caller
from engine.query.queries import Queries
from engine.subcommand.output import Output
from engine.subcommand.read_subcommand import ReadSubcommand
from core.modules.agents.models.agent import MAIN_ROLE, MAIN_TITLE, Agent
from core.modules.agents.models.enums.agent_activity import AgentActivity
from core.modules.agents.support.agent_label import AgentLabel
from core.modules.usage.commands.usage_agents.usage_agents_subcommand import UsageAgentsSubcommand
from core.modules.usage.support.agent_tip import AgentTip


class AgentTipSubcommand(ReadSubcommand[AgentTip]):
    """`journal agent tip <n>`: what the tooltip of agent n shows, the one read every window may make."""

    cli_name = "agent"
    name = "tip"
    environment_refusal = "an agent is shown for one environment"

    def __init__(self, queries: Queries, usage: UsageAgentsSubcommand) -> None:
        self.queries, self.usage = queries, usage

    def arguments(self, parser: ArgumentParser) -> None:
        parser.add_argument("agent_id", type=AgentNumber)

    def read(self, arguments: Namespace, caller: Caller) -> AgentTip:
        agent = self.queries.query(Agent).find(arguments.agent_id)
        facts = self.usage.listing(True, agent.id, [agent]).agents[0]
        title = facts.profile_title or (MAIN_TITLE if agent.role == MAIN_ROLE else agent.role.capitalize())
        return AgentTip(agent.id, title, agent.display_name, agent.program, facts.model, facts.effort, AgentLabel.labelled(agent).text if facts.job_enabled else "",
                        agent.activity, agent.retired_at is not None, self.state_start(agent), facts.last_activity)

    @staticmethod
    def state_start(agent: Agent) -> str:
        if agent.retired_at is not None:
            return agent.retired_at.text
        if agent.activity is AgentActivity.ENDED and agent.ended_at is not None:
            return agent.ended_at.text
        return (agent.process_started_at or agent.creation_timestamp()).text

    def write_output(self, value: object, output: Output) -> None:
        if isinstance(value, AgentTip):
            output.write(value.line(), value.json())
