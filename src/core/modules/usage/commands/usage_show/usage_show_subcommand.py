from core.modules.drivers.support.current_context_window import CurrentContextWindow
from core.modules.drivers.support.context_compactions import ContextCompactions
from core.modules.agents.support.agent_rows import RUNNING_AGENTS_REASON
from core.modules.settings.bindings.support.context_share import ContextShare
from collections.abc import Sequence
from argparse import ArgumentParser, Namespace
from dataclasses import replace

from engine.enums.helper_role import HelperRole
from engine.query.conditions.excluding import Excluding
from core.modules.usage.conditions.agent_activity import AgentActivity
from engine.caller.caller import Caller
from engine.driver.program_lockdown import ProgramLockdown
from engine.query.conditions.among import Among
from engine.query.conditions.greater import Greater
from engine.query.queries import Queries
from engine.query.query import Query
from engine.subcommand.output import Output
from engine.subcommand.read_subcommand import ReadSubcommand
from engine.enums.hook_event_name import HookEventName
from core.modules.agents.models.agent import Agent
from core.modules.drivers.models.hook_call import HookCall
from core.modules.usage.support.compaction import Compaction
from core.modules.usage.support.environment_usage import EnvironmentUsage
from core.modules.usage.support.session_status import SessionStatus
from engine.provider.context_window import ContextWindow
from core.modules.usage.support.status_files import StatusFiles
from core.modules.agents.queries.agent_query import AgentQuery
from core.modules.agents.support.agent_label import AgentLabel

RECENT_COMPACTION_CALLS = 50
ENDED_HELPERS_COUNTED = 50


class UsageShowSubcommand(ReadSubcommand[EnvironmentUsage]):
    """`journal usage show [--open] [--environment <name>]`: each open session of the environment with
    the model, context and cost its status line last reported, the plan's windows, each program
    stopped at a usage limit with how many of its agents are halted, and the sessions' cost added
    up. The ended helpers of the open sessions count too, unless --open asks for the open sessions
    alone."""

    cli_name = "usage"
    name = "show"
    environment_refusal = "usage is shown for one environment"

    def __init__(self, queries: Queries, agents: AgentQuery, files: StatusFiles, activity: AgentActivity, share: ContextShare, lockdown: ProgramLockdown, context_compactions: ContextCompactions, current_window: CurrentContextWindow) -> None:
        self.lockdown, self.context_compactions, self.current_window = lockdown, context_compactions, current_window
        self.activity, self.share = activity, share
        self.queries, self.agents, self.files = queries, agents, files

    def arguments(self, parser: ArgumentParser) -> None:
        parser.add_argument("--open", action="store_true", dest="open_only", help="only the open sessions, without their ended helpers")

    def read(self, arguments: Namespace, caller: Caller) -> EnvironmentUsage:
        activity = self.activity.current()
        opened = tuple(self.agents.matching(activity).every_row(RUNNING_AGENTS_REASON))
        counted = opened if arguments.open_only else (*opened, *self.ended_helpers(self.agents, opened))
        statuses = {agent.session: self.with_share(agent) for agent in counted}
        return EnvironmentUsage(tuple((agent, statuses[agent.session]) for agent in counted), self.files.plan_windows(statuses), activity.pending)

    def with_share(self, agent: Agent) -> SessionStatus:
        status = self.files.status(agent.session)
        usage = self.share.agent_usage(agent)
        if self.current_window.is_unknown(agent):
            return replace(status, context=replace(status.context, used_percentage=None, total_input_tokens=None))
        if status.context.used_percentage is None:
            return status
        return replace(status, context=ContextWindow(usage.percent, usage.used_tokens, status.context.read_at, usage.window_tokens), context_limit_tokens=usage.limit_tokens)

    @staticmethod
    def ended_helpers(agents: Query[Agent], opened: tuple[Agent, ...]) -> tuple[Agent, ...]:
        helpers = agents.filter(role=HelperRole.HELPER).matching(Greater("ended_at", "")).matching(Among("parent_id", tuple(agent.id for agent in opened))).matching(Excluding(Among("id", tuple(agent.id for agent in opened))))
        return tuple(helpers.newest().take(ENDED_HELPERS_COUNTED)[::-1])

    def write_output(self, value: object, output: Output) -> None:
        if not isinstance(value, EnvironmentUsage):
            return
        compactions = self.last_compactions([agent for agent, _ in value.agents])
        context_changes = self.context_compactions.newest_rows([agent.id for agent, _ in value.agents])
        pending = value.pending_work
        lines = [self.agent_line(agent, status) for agent, status in value.agents]
        lines.append(f"plan: {'; '.join(window.line for window in value.windows)}" if value.windows else "plan: no limits reported yet")
        lines.append(f"cost of the open sessions: ${value.cost_dollars:.2f}")
        output.write("\n".join(lines), {"agents": [{**output.values(agent), "work_status": pending.get(agent.id), "last_compacted_at": compactions[agent.id].started_at if agent.id in compactions else None, "last_compaction": compactions[agent.id].json() if agent.id in compactions else None, "context_change": context_changes[agent.id].json() if agent.id in context_changes else None, "context_unknown": self.current_window.is_unknown(agent), "model": status.model, "effort": status.effort, "context_percent": status.context.used_percentage, "context_tokens": status.context.total_input_tokens, "context_limit_tokens": status.context_limit_tokens, "context_window_tokens": status.context.window_size_tokens,
                                                    "cost_dollars": status.cost_dollars} for agent, status in value.agents],
                                        "windows": [output.values(window) for window in value.windows], "cost_dollars": value.cost_dollars,
                                        "lockdowns": self.lockdowns([agent for agent, _ in value.agents])})

    def lockdowns(self, agents: Sequence[Agent]) -> list[dict[str, object]]:
        active = {program: lockdown for program in dict.fromkeys(agent.program for agent in agents) if (lockdown := self.lockdown.lockdown(program)).is_active}
        return [{"program": program, "reason": lockdown.reason, "ends_at": lockdown.ends_at.text if lockdown.ends_at is not None else None, "limit_id": lockdown.limit_id,
                 "halted_count": sum(1 for agent in agents if agent.program == program and agent.halted_at is not None and agent.ended_at is None)} for program, lockdown in active.items()]

    def last_compactions(self, agents: Sequence[Agent]) -> dict[int, Compaction]:
        calls = self.queries.query(HookCall).matching(Among("hook", (HookEventName.COMPACT, HookEventName.SESSION_START))).matching(Among("session_agent_id", tuple(agent.id for agent in agents))).newest().take(RECENT_COMPACTION_CALLS)[::-1]
        compactions = {agent.id: Compaction.last([call for call in calls if call.session_agent_id == agent.id]) for agent in agents}
        return {agent_id: compaction for agent_id, compaction in compactions.items() if compaction is not None}

    @staticmethod
    def agent_line(agent: Agent, status: SessionStatus) -> str:
        start = f"{AgentLabel.from_agent(agent).text}  {agent.session}  {agent.program}"
        if not status.is_reported:
            return f"{start}  nothing reported yet"
        context = f"  context {status.context.used_percentage}%" if status.context.used_percentage is not None else ""
        return f"{start}  {status.model or 'model not reported'}{context}  {'cost not known' if status.cost_dollars is None else f'cost ${status.cost_dollars:.2f}'}"
