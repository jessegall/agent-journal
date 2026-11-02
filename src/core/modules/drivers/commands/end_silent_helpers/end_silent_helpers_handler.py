from core.base.agent_role import AgentRole
from core.base.command.bus import Bus
from core.base.command.context import Context
from core.base.command.handler import Handler
from core.base.query.conditions.is_null import IsNull
from core.base.query.queries import Queries
from core.modules.agents.commands.end_agent.end_agent import EndAgent
from core.modules.agents.models.agent import Agent
from core.modules.drivers.commands.end_silent_helpers.end_silent_helpers import EndSilentHelpers
from core.modules.drivers.queries.hook_call_query import HookCallQuery

SILENT_HELPER_SECONDS = 1800


class EndSilentHelpersHandler(Handler[EndSilentHelpers, None]):
    """A helper's stop never arrives when the journal was away or its program was killed, so a helper that has
    sent no hook for half an hour ends and stops counting as running."""

    command = EndSilentHelpers

    def __init__(self, queries: Queries, hook_calls: HookCallQuery, bus: Bus) -> None:
        self.queries, self.hook_calls, self.bus = queries, hook_calls, bus

    def handle(self, command: EndSilentHelpers, context: Context) -> None:
        helpers = self.queries.query(Agent).filter(environment_id=command.environment_id, role=AgentRole.SUBAGENT).matching(IsNull("ended_at")).all_rows()
        for helper in tuple(helpers):
            calls = self.hook_calls.agent(helper.id).newest().page(1, 1).rows
            last_call_time = calls[0].creation_timestamp() if calls else helper.creation_timestamp()
            if last_call_time.elapsed_seconds(context.timestamp) >= SILENT_HELPER_SECONDS:
                self.bus.dispatch(EndAgent(helper.id), context)
