from collections.abc import Sequence
from argparse import Namespace

from core.base.agent_role import AgentRole
from core.base.caller.caller import Caller
from core.base.query.conditions.among import Among
from core.base.query.conditions.greater import Greater
from core.base.query.queries import Queries
from core.base.query.query import Query
from core.base.subcommand.output import Output
from core.base.subcommand.read_subcommand import ReadSubcommand
from core.base.driver.hook_event_name import HookEventName
from core.modules.agents.models.agent import Agent
from core.modules.drivers.models.hook_call import HookCall
from core.modules.usage.support.compaction import Compaction
from core.modules.usage.support.environment_usage import EnvironmentUsage
from core.modules.usage.support.session_status import SessionStatus
from core.modules.usage.support.status_files import StatusFiles
from core.modules.agents.queries.agent_query import AgentQuery


class UsageShowSubcommand(ReadSubcommand[EnvironmentUsage]):
    """`journal usage show [--environment <name>]`: each open session of the environment with the model,
    context and cost its status line last reported, the plan's windows and the sessions' cost added up."""

    cli_name = "usage"
    name = "show"
    environment_refusal = "usage is shown for one environment"

    def __init__(self, queries: Queries, agents: AgentQuery, files: StatusFiles) -> None:
        self.queries, self.agents, self.files = queries, agents, files

    def read(self, arguments: Namespace, caller: Caller) -> EnvironmentUsage:
        opened = tuple(self.agents.running().oldest().all_rows())
        counted = (*opened, *self.ended_helpers(self.agents, opened))
        statuses = {agent.session: self.files.status(agent.session) for agent in counted}
        return EnvironmentUsage(tuple((agent, statuses[agent.session]) for agent in counted), self.files.plan_windows(statuses))

    @staticmethod
    def ended_helpers(agents: Query[Agent], opened: tuple[Agent, ...]) -> tuple[Agent, ...]:
        helpers = agents.filter(role=AgentRole.HELPER).matching(Greater("ended_at", "")).matching(Among("parent_id", tuple(agent.id for agent in opened)))
        return tuple(helpers.oldest().all_rows())

    def write_output(self, value: object, output: Output) -> None:
        if not isinstance(value, EnvironmentUsage):
            return
        compactions = self.last_compactions([agent for agent, _ in value.agents])
        lines = [self.agent_line(agent, status) for agent, status in value.agents]
        lines.append(f"plan: {'; '.join(window.line for window in value.windows)}" if value.windows else "plan: no limits reported yet")
        lines.append(f"cost of the open sessions: ${value.cost_dollars:.2f}")
        output.write("\n".join(lines), {"agents": [{**output.values(agent), "last_compacted_at": compactions[agent.id].started_at if agent.id in compactions else None, "last_compaction": compactions[agent.id].json() if agent.id in compactions else None, "model": status.model, "effort": status.effort, "context_percent": status.context_percent,
                                                    "cost_dollars": status.cost_dollars} for agent, status in value.agents],
                                        "windows": [output.values(window) for window in value.windows], "cost_dollars": value.cost_dollars})

    def last_compactions(self, agents: Sequence[Agent]) -> dict[int, Compaction]:
        calls = self.queries.query(HookCall).matching(Among("hook", (HookEventName.COMPACT, HookEventName.SESSION_START))).matching(Among("session_agent_id", tuple(agent.id for agent in agents))).oldest().all_rows()
        compactions = {agent.id: Compaction.last([call for call in calls if call.session_agent_id == agent.id]) for agent in agents}
        return {agent_id: compaction for agent_id, compaction in compactions.items() if compaction is not None}

    @staticmethod
    def agent_line(agent: Agent, status: SessionStatus) -> str:
        start = f"agent {agent.id}  {agent.session}  {agent.program}"
        if not status.is_reported:
            return f"{start}  nothing reported yet"
        context = f"  context {status.context_percent}%" if status.context_percent is not None else ""
        return f"{start}  {status.model or 'model not reported'}{context}  {'cost not known' if status.cost_dollars is None else f'cost ${status.cost_dollars:.2f}'}"
