from argparse import Namespace

from core.base.caller.caller import Caller
from core.base.query.conditions.is_null import IsNull
from core.base.query.queries import Queries
from core.base.subcommand.output import Output
from core.base.subcommand.read_subcommand import ReadSubcommand
from core.base.driver.hook_event_name import HookEventName
from core.modules.agents.models.agent import Agent
from core.modules.drivers.models.hook_call import HookCall
from core.modules.usage.support.environment_usage import EnvironmentUsage
from core.modules.usage.support.session_status import SessionStatus
from core.modules.usage.support.status_files import StatusFiles


class UsageShowSubcommand(ReadSubcommand[EnvironmentUsage]):
    """`journal usage show [--environment <name>]`: each open session of the environment with the model,
    context and cost its status line last reported, the plan's windows and the sessions' cost added up."""

    cli_name = "usage"
    name = "show"
    environment_refusal = "usage is shown for one environment"

    def __init__(self, queries: Queries, files: StatusFiles) -> None:
        self.queries, self.files = queries, files

    def read(self, arguments: Namespace, caller: Caller) -> EnvironmentUsage:
        agents = self.queries.query(Agent).matching(IsNull("ended_at")).oldest().all_rows()
        return EnvironmentUsage(tuple((agent, self.files.status(agent.session)) for agent in agents), self.files.plan_windows())

    def write_output(self, value: object, output: Output) -> None:
        if not isinstance(value, EnvironmentUsage):
            return
        lines = [self.agent_line(agent, status) for agent, status in value.agents]
        lines.append(f"plan: {'; '.join(window.line for window in value.windows)}" if value.windows else "plan: no limits reported yet")
        lines.append(f"cost of the open sessions: ${value.cost_dollars:.2f}")
        output.write("\n".join(lines), {"agents": [{**output.values(agent), "last_compacted_at": self.last_compacted(agent), "model": status.model, "effort": status.effort, "context_percent": status.context_percent,
                                                    "cost_dollars": status.cost_dollars} for agent, status in value.agents],
                                        "windows": [output.values(window) for window in value.windows], "cost_dollars": value.cost_dollars})

    def last_compacted(self, agent: Agent) -> str | None:
        calls = self.queries.query(HookCall).filter(session_agent_id=agent.id, hook=HookEventName.COMPACT).newest().limited(1)
        return calls[0].creation_timestamp().text if calls else None

    @staticmethod
    def agent_line(agent: Agent, status: SessionStatus) -> str:
        start = f"agent {agent.id}  {agent.session}  {agent.program}"
        if not status.is_reported:
            return f"{start}  nothing reported yet"
        context = f"  context {status.context_percent}%" if status.context_percent is not None else ""
        return f"{start}  {status.model or 'model not reported'}{context}  {'cost not known' if status.cost_dollars is None else f'cost ${status.cost_dollars:.2f}'}"
